import Fee from "../models/Fee.js";
import Student from "../models/Student.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/*
|--------------------------------------------------------------------------
| Calculate Fee Status
|--------------------------------------------------------------------------
*/

const calculateFeeStatus = (
  totalAmount,
  paidAmount,
  dueDate
) => {
  const total = Number(totalAmount) || 0;
  const paid = Number(paidAmount) || 0;

  const remaining = Math.max(
    total - paid,
    0
  );

  if (remaining === 0 && total > 0) {
    return "paid";
  }

  if (paid > 0 && remaining > 0) {
    return "partial";
  }

  if (
    dueDate &&
    new Date(dueDate) < new Date() &&
    remaining > 0
  ) {
    return "overdue";
  }

  return "unpaid";
};

/*
|--------------------------------------------------------------------------
| Create Fee
|--------------------------------------------------------------------------
*/

const createFee = asyncHandler(
  async (req, res) => {
    const {
      student,
      month,
      totalAmount,
      paidAmount = 0,
      dueDate,
      paymentDate,
      paymentMethod = "cash",
      receiptNumber = "",
      notes = "",
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    if (!student) {
      throw new ApiError(
        400,
        "Student is required."
      );
    }

    if (!month) {
      throw new ApiError(
        400,
        "Fee month is required."
      );
    }

    if (
      totalAmount === undefined ||
      totalAmount === null ||
      totalAmount === ""
    ) {
      throw new ApiError(
        400,
        "Total fee amount is required."
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Find Student
    |--------------------------------------------------------------------------
    */

    const studentRecord =
      await Student.findById(student);

    if (!studentRecord) {
      throw new ApiError(
        404,
        "Student not found."
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Amount Validation
    |--------------------------------------------------------------------------
    */

    const total = Number(totalAmount);
    const paid = Number(paidAmount);

    if (
      Number.isNaN(total) ||
      total < 0
    ) {
      throw new ApiError(
        400,
        "Invalid total fee amount."
      );
    }

    if (
      Number.isNaN(paid) ||
      paid < 0
    ) {
      throw new ApiError(
        400,
        "Invalid paid amount."
      );
    }

    if (paid > total) {
      throw new ApiError(
        400,
        "Paid amount cannot be greater than total fee."
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Check Duplicate
    |--------------------------------------------------------------------------
    */

    const existingFee =
      await Fee.findOne({
        student: studentRecord._id,
        month: month.trim(),
      });

    if (existingFee) {
      throw new ApiError(
        409,
        "A fee record already exists for this student and month."
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Remaining + Status
    |--------------------------------------------------------------------------
    */

    const remaining = Math.max(
      total - paid,
      0
    );

    const status = calculateFeeStatus(
      total,
      paid,
      dueDate
    );

    /*
    |--------------------------------------------------------------------------
    | Create Fee
    |--------------------------------------------------------------------------
    */

    const fee = await Fee.create({
      student: studentRecord._id,

      class: studentRecord.class,

      month: month.trim(),

      totalAmount: total,

      paidAmount: paid,

      remainingAmount: remaining,

      status,

      dueDate:
        dueDate || null,

      paymentDate:
        paymentDate || null,

      paymentMethod,

      receiptNumber:
        receiptNumber.trim(),

      notes:
        notes.trim(),

      createdBy:
        req.user?._id || null,
    });

    /*
    |--------------------------------------------------------------------------
    | Populate Student
    |--------------------------------------------------------------------------
    */

    const populatedFee =
      await Fee.findById(
        fee._id
      ).populate(
        "student",
        "name fatherName admissionNumber rollNumber class photo"
      );

    res.status(201).json({
      success: true,
      message:
        "Fee created successfully.",
      data: populatedFee,
    });
  }
);

/*
|--------------------------------------------------------------------------
| Get All Fees
|--------------------------------------------------------------------------
*/

const getFees = asyncHandler(
  async (req, res) => {
    const {
      student,
      class: className,
      month,
      status,
    } = req.query;

    const filter = {};

    if (student) {
      filter.student = student;
    }

    if (className) {
      filter.class = className;
    }

    if (month) {
      filter.month = month;
    }

    if (status) {
      filter.status = status;
    }

    const fees =
      await Fee.find(filter)
        .populate(
          "student",
          "name fatherName admissionNumber rollNumber class photo"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: fees.length,
      data: fees,
    });
  }
);

/*
|--------------------------------------------------------------------------
| Get Fee By ID
|--------------------------------------------------------------------------
*/

const getFeeById = asyncHandler(
  async (req, res) => {
    const fee =
      await Fee.findById(
        req.params.id
      ).populate(
        "student",
        "name fatherName admissionNumber rollNumber class photo"
      );

    if (!fee) {
      throw new ApiError(
        404,
        "Fee record not found."
      );
    }

    res.status(200).json({
      success: true,
      data: fee,
    });
  }
);

/*
|--------------------------------------------------------------------------
| Get Fees By Student
|--------------------------------------------------------------------------
*/

const getStudentFees = asyncHandler(
  async (req, res) => {
    const student =
      await Student.findById(
        req.params.studentId
      );

    if (!student) {
      throw new ApiError(
        404,
        "Student not found."
      );
    }

    const fees =
      await Fee.find({
        student: student._id,
      })
        .populate(
          "student",
          "name fatherName admissionNumber rollNumber class photo"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: fees.length,
      data: fees,
    });
  }
);

/*
|--------------------------------------------------------------------------
| Update Fee
|--------------------------------------------------------------------------
*/

const updateFee = asyncHandler(
  async (req, res) => {
    const fee =
      await Fee.findById(
        req.params.id
      );

    if (!fee) {
      throw new ApiError(
        404,
        "Fee record not found."
      );
    }

    const {
      month,
      totalAmount,
      paidAmount,
      dueDate,
      paymentDate,
      paymentMethod,
      receiptNumber,
      notes,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Update Basic Fields
    |--------------------------------------------------------------------------
    */

    if (
      month !== undefined
    ) {
      fee.month =
        month.trim();
    }

    if (
      totalAmount !== undefined
    ) {
      const total =
        Number(totalAmount);

      if (
        Number.isNaN(total) ||
        total < 0
      ) {
        throw new ApiError(
          400,
          "Invalid total fee amount."
        );
      }

      fee.totalAmount =
        total;
    }

    if (
      paidAmount !== undefined
    ) {
      const paid =
        Number(paidAmount);

      if (
        Number.isNaN(paid) ||
        paid < 0
      ) {
        throw new ApiError(
          400,
          "Invalid paid amount."
        );
      }

      fee.paidAmount =
        paid;
    }

    if (
      fee.paidAmount >
      fee.totalAmount
    ) {
      throw new ApiError(
        400,
        "Paid amount cannot be greater than total fee."
      );
    }

    if (
      dueDate !== undefined
    ) {
      fee.dueDate =
        dueDate || null;
    }

    if (
      paymentDate !== undefined
    ) {
      fee.paymentDate =
        paymentDate || null;
    }

    if (
      paymentMethod !== undefined
    ) {
      fee.paymentMethod =
        paymentMethod;
    }

    if (
      receiptNumber !== undefined
    ) {
      fee.receiptNumber =
        receiptNumber.trim();
    }

    if (
      notes !== undefined
    ) {
      fee.notes =
        notes.trim();
    }

    /*
    |--------------------------------------------------------------------------
    | Recalculate
    |--------------------------------------------------------------------------
    */

    fee.remainingAmount =
      Math.max(
        fee.totalAmount -
          fee.paidAmount,
        0
      );

    fee.status =
      calculateFeeStatus(
        fee.totalAmount,
        fee.paidAmount,
        fee.dueDate
      );

    await fee.save();

    /*
    |--------------------------------------------------------------------------
    | Populate
    |--------------------------------------------------------------------------
    */

    const populatedFee =
      await Fee.findById(
        fee._id
      ).populate(
        "student",
        "name fatherName admissionNumber rollNumber class photo"
      );

    res.status(200).json({
      success: true,
      message:
        "Fee updated successfully.",
      data: populatedFee,
    });
  }
);

/*
|--------------------------------------------------------------------------
| Delete Fee
|--------------------------------------------------------------------------
*/

const deleteFee = asyncHandler(
  async (req, res) => {
    const fee =
      await Fee.findById(
        req.params.id
      );

    if (!fee) {
      throw new ApiError(
        404,
        "Fee record not found."
      );
    }

    await fee.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Fee deleted successfully.",
    });
  }
);

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

export {
  createFee,
  getFees,
  getFeeById,
  getStudentFees,
  updateFee,
  deleteFee,
};