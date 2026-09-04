import FeeStructure from "../models/FeeStructure.js";
import Class from "../models/Class.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/*
|--------------------------------------------------------------------------
| Create Fee Structure
|--------------------------------------------------------------------------
*/

const createFeeStructure = asyncHandler(
  async (req, res) => {
    const {
      class: className,
      monthlyFee,
      dueDay = 10,
      notes = "",
    } = req.body;

    if (!className) {
      throw new ApiError(
        400,
        "Class is required."
      );
    }

    if (
      monthlyFee === undefined ||
      monthlyFee === null ||
      monthlyFee === ""
    ) {
      throw new ApiError(
        400,
        "Monthly fee is required."
      );
    }

    const classRecord =
      await Class.findOne({
        name: className.trim(),
      });

    if (!classRecord) {
      throw new ApiError(
        404,
        "Class not found."
      );
    }

    const amount =
      Number(monthlyFee);

    if (
      Number.isNaN(amount) ||
      amount < 0
    ) {
      throw new ApiError(
        400,
        "Invalid monthly fee amount."
      );
    }

    const day =
      Number(dueDay);

    if (
      Number.isNaN(day) ||
      day < 1 ||
      day > 31
    ) {
      throw new ApiError(
        400,
        "Due day must be between 1 and 31."
      );
    }

    const existing =
      await FeeStructure.findOne({
        class: className.trim(),
      });

    if (existing) {
      throw new ApiError(
        409,
        "A fee structure already exists for this class."
      );
    }

    const feeStructure =
      await FeeStructure.create({
        class: className.trim(),

        monthlyFee: amount,

        dueDay: day,

        notes: notes.trim(),

        createdBy:
          req.user?._id || null,
      });

    res.status(201).json({
      success: true,
      message:
        "Fee structure created successfully.",
      data: feeStructure,
    });
  }
);

/*
|--------------------------------------------------------------------------
| Get All Fee Structures
|--------------------------------------------------------------------------
*/

const getFeeStructures = asyncHandler(
  async (req, res) => {
    const {
      status,
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    const feeStructures =
      await FeeStructure.find(
        filter
      ).sort({
        class: 1,
      });

    res.status(200).json({
      success: true,
      count:
        feeStructures.length,
      data: feeStructures,
    });
  }
);

/*
|--------------------------------------------------------------------------
| Get Fee Structure By ID
|--------------------------------------------------------------------------
*/

const getFeeStructureById =
  asyncHandler(
    async (req, res) => {
      const feeStructure =
        await FeeStructure.findById(
          req.params.id
        );

      if (!feeStructure) {
        throw new ApiError(
          404,
          "Fee structure not found."
        );
      }

      res.status(200).json({
        success: true,
        data: feeStructure,
      });
    }
  );

/*
|--------------------------------------------------------------------------
| Update Fee Structure
|--------------------------------------------------------------------------
*/

const updateFeeStructure =
  asyncHandler(
    async (req, res) => {
      const feeStructure =
        await FeeStructure.findById(
          req.params.id
        );

      if (!feeStructure) {
        throw new ApiError(
          404,
          "Fee structure not found."
        );
      }

      const {
        class: className,
        monthlyFee,
        dueDay,
        status,
        notes,
      } = req.body;

      /*
      |--------------------------------------------------------------------------
      | Class
      |--------------------------------------------------------------------------
      */

      if (
        className !== undefined
      ) {
        const trimmedClass =
          className.trim();

        const classRecord =
          await Class.findOne({
            name: trimmedClass,
          });

        if (!classRecord) {
          throw new ApiError(
            404,
            "Class not found."
          );
        }

        const duplicate =
          await FeeStructure.findOne({
            class: trimmedClass,
            _id: {
              $ne:
                feeStructure._id,
            },
          });

        if (duplicate) {
          throw new ApiError(
            409,
            "A fee structure already exists for this class."
          );
        }

        feeStructure.class =
          trimmedClass;
      }

      /*
      |--------------------------------------------------------------------------
      | Monthly Fee
      |--------------------------------------------------------------------------
      */

      if (
        monthlyFee !== undefined
      ) {
        const amount =
          Number(monthlyFee);

        if (
          Number.isNaN(amount) ||
          amount < 0
        ) {
          throw new ApiError(
            400,
            "Invalid monthly fee amount."
          );
        }

        feeStructure.monthlyFee =
          amount;
      }

      /*
      |--------------------------------------------------------------------------
      | Due Day
      |--------------------------------------------------------------------------
      */

      if (
        dueDay !== undefined
      ) {
        const day =
          Number(dueDay);

        if (
          Number.isNaN(day) ||
          day < 1 ||
          day > 31
        ) {
          throw new ApiError(
            400,
            "Due day must be between 1 and 31."
          );
        }

        feeStructure.dueDay =
          day;
      }

      /*
      |--------------------------------------------------------------------------
      | Status
      |--------------------------------------------------------------------------
      */

      if (
        status !== undefined
      ) {
        if (
          ![
            "active",
            "inactive",
          ].includes(status)
        ) {
          throw new ApiError(
            400,
            "Invalid fee structure status."
          );
        }

        feeStructure.status =
          status;
      }

      /*
      |--------------------------------------------------------------------------
      | Notes
      |--------------------------------------------------------------------------
      */

      if (
        notes !== undefined
      ) {
        feeStructure.notes =
          notes.trim();
      }

      await feeStructure.save();

      res.status(200).json({
        success: true,
        message:
          "Fee structure updated successfully.",
        data: feeStructure,
      });
    }
  );

/*
|--------------------------------------------------------------------------
| Delete Fee Structure
|--------------------------------------------------------------------------
*/

const deleteFeeStructure =
  asyncHandler(
    async (req, res) => {
      const feeStructure =
        await FeeStructure.findById(
          req.params.id
        );

      if (!feeStructure) {
        throw new ApiError(
          404,
          "Fee structure not found."
        );
      }

      await feeStructure.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Fee structure deleted successfully.",
      });
    }
  );

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

export {
  createFeeStructure,
  getFeeStructures,
  getFeeStructureById,
  updateFeeStructure,
  deleteFeeStructure,
};