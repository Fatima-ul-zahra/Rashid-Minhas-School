import Announcement from "../models/Announcement.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/*
|--------------------------------------------------------------------------
| Get Public Announcements
|--------------------------------------------------------------------------
| Public users only see published announcements.
*/
const getPublicAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find({
    status: "published",
  }).sort({
    date: -1,
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    data: announcements,
  });
});

/*
|--------------------------------------------------------------------------
| Get Admin Announcements
|--------------------------------------------------------------------------
| Admin/staff can see all announcements.
*/
const getAdminAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find({})
    .sort({
      date: -1,
      createdAt: -1,
    });

  res.status(200).json({
    success: true,
    data: announcements,
  });
});

/*
|--------------------------------------------------------------------------
| Get Single Announcement
|--------------------------------------------------------------------------
*/
const getAnnouncementById = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);

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
});

/*
|--------------------------------------------------------------------------
| Create Announcement
|--------------------------------------------------------------------------
*/
const createAnnouncement = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    date,
    status,
  } = req.body;

  if (!title || !title.trim()) {
    throw new ApiError(
      400,
      "Announcement title is required."
    );
  }

  if (!description || !description.trim()) {
    throw new ApiError(
      400,
      "Announcement description is required."
    );
  }

  const announcement = await Announcement.create({
    title: title.trim(),
    description: description.trim(),
    date: date || new Date(),
    status: status || "unpublished",

    image: req.file
      ? `/uploads/announcements/${req.file.filename}`
      : "",
  });

  res.status(201).json({
    success: true,
    message: "Announcement created successfully.",
    data: announcement,
  });
});

/*
|--------------------------------------------------------------------------
| Update Announcement
|--------------------------------------------------------------------------
*/
const updateAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(
    req.params.id
  );

  if (!announcement) {
    throw new ApiError(
      404,
      "Announcement not found."
    );
  }

  const {
    title,
    description,
    date,
    status,
  } = req.body;

  if (title !== undefined) {
    announcement.title = title.trim();
  }

  if (description !== undefined) {
    announcement.description = description.trim();
  }

  if (date !== undefined) {
    announcement.date = date;
  }

  if (status !== undefined) {
    announcement.status = status;
  }

  /*
  |--------------------------------------------------------------------------
  | Update image only when a new file is selected
  |--------------------------------------------------------------------------
  */
  if (req.file) {
    announcement.image =
      `/uploads/announcements/${req.file.filename}`;
  }

  await announcement.save();

  res.status(200).json({
    success: true,
    message: "Announcement updated successfully.",
    data: announcement,
  });
});

/*
|--------------------------------------------------------------------------
| Delete Announcement
|--------------------------------------------------------------------------
*/
const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(
    req.params.id
  );

  if (!announcement) {
    throw new ApiError(
      404,
      "Announcement not found."
    );
  }

  await announcement.deleteOne();

  res.status(200).json({
    success: true,
    message: "Announcement deleted successfully.",
  });
});

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/
export {
  getPublicAnnouncements,
  getAdminAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};