import Announcement from "../models/Announcement.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const getAnnouncements = asyncHandler(async (req, res) => {
  const filter = {};

  // Public users only see published announcements.
  if (!req.user) {
    filter.status = "published";
  }

  const announcements = await Announcement.find(filter)
    .sort({ date: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    data: announcements,
  });
});

const getAnnouncementById = asyncHandler(
  async (req, res) => {
    const announcement =
      await Announcement.findById(req.params.id);

    if (!announcement) {
      throw new ApiError(
        404,
        "Announcement not found."
      );
    }

    res.status(200).json({
      success: true,
      data: announcement,
    });
  }
);

const createAnnouncement = asyncHandler(
  async (req, res) => {
    const {
      title,
      description,
      date,
      image,
      status,
    } = req.body;

    if (!title || !description) {
      throw new ApiError(
        400,
        "Title and description are required."
      );
    }

    const announcement =
      await Announcement.create({
        title: title.trim(),
        description: description.trim(),
        date: date || Date.now(),
        image: image || "",
        status: status || "unpublished",
      });

    res.status(201).json({
      success: true,
      message:
        "Announcement created successfully.",
      data: announcement,
    });
  }
);

const updateAnnouncement = asyncHandler(
  async (req, res) => {
    const announcement =
      await Announcement.findById(req.params.id);

    if (!announcement) {
      throw new ApiError(
        404,
        "Announcement not found."
      );
    }

    Object.assign(announcement, req.body);

    await announcement.save();

    res.status(200).json({
      success: true,
      message:
        "Announcement updated successfully.",
      data: announcement,
    });
  }
);

const deleteAnnouncement = asyncHandler(
  async (req, res) => {
    const announcement =
      await Announcement.findById(req.params.id);

    if (!announcement) {
      throw new ApiError(
        404,
        "Announcement not found."
      );
    }

    await announcement.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Announcement deleted successfully.",
    });
  }
);

export {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};