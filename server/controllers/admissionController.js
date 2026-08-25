import Admission from "../models/Admission.js";
import Class from "../models/Class.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const getAdmissions = asyncHandler(async (req, res) => {
  const admissions = await Admission.find()
    .populate("desiredClass", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: admissions,
  });
});

const getAdmissionById = asyncHandler(
  async (req, res) => {
    const admission = await Admission.findById(
      req.params.id
    ).populate("desiredClass", "name");

    if (!admission) {
      throw new ApiError(
        404,
        "Admission application not found."
      );
    }

    res.status(200).json({
      success: true,
      data: admission,
    });
  }
);

const createAdmission = asyncHandler(
  async (req, res) => {
    const {
      studentName,
      fatherName,
      dateOfBirth,
      gender,
      previousSchool,
      desiredClass,
      phone,
      email,
      address,
      documents,
    } = req.body;

    if (
      !studentName ||
      !fatherName ||
      !desiredClass ||
      !phone
    ) {
      throw new ApiError(
        400,
        "Student name, father name, class and phone are required."
      );
    }

    const classExists = await Class.findById(
      desiredClass
    );

    if (!classExists) {
      throw new ApiError(
        400,
        "Selected class does not exist."
      );
    }

    const admission = await Admission.create({
      studentName: studentName.trim(),
      fatherName: fatherName.trim(),
      dateOfBirth,
      gender,
      previousSchool,
      desiredClass,
      phone: phone.trim(),
      email,
      address,
      documents,
    });

    const populatedAdmission =
      await Admission.findById(
        admission._id
      ).populate("desiredClass", "name");

    res.status(201).json({
      success: true,
      message:
        "Admission application submitted successfully.",
      data: populatedAdmission,
    });
  }
);

const updateAdmission = asyncHandler(
  async (req, res) => {
    const admission = await Admission.findById(
      req.params.id
    );

    if (!admission) {
      throw new ApiError(
        404,
        "Admission application not found."
      );
    }

    if (req.body.desiredClass) {
      const classExists = await Class.findById(
        req.body.desiredClass
      );

      if (!classExists) {
        throw new ApiError(
          400,
          "Selected class does not exist."
        );
      }
    }

    Object.assign(admission, req.body);

    await admission.save();

    const populatedAdmission =
      await Admission.findById(
        admission._id
      ).populate("desiredClass", "name");

    res.status(200).json({
      success: true,
      message:
        "Admission application updated successfully.",
      data: populatedAdmission,
    });
  }
);

const deleteAdmission = asyncHandler(
  async (req, res) => {
    const admission = await Admission.findById(
      req.params.id
    );

    if (!admission) {
      throw new ApiError(
        404,
        "Admission application not found."
      );
    }

    await admission.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Admission application deleted successfully.",
    });
  }
);

export {
  getAdmissions,
  getAdmissionById,
  createAdmission,
  updateAdmission,
  deleteAdmission,
};