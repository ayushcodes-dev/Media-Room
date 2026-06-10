import express from "express";
import {
  createProjectValidator,
  renameProjectValidator,
  saveVideoDescValidator,
  saveCustomPromptValidator,
} from "#/validator/project.validator.js";
import validate from "#/validator/index.validate.js";

import {
  getProjects,
  getContent,
  getThumbnail,
  getProjectById,
  createProject,
  deleteProject,
  renameProject,
  saveVideoDesc,
  saveCustomPrompt,
  projectStatus,
} from "#/features/project/index.project.js";

const router = express.Router();

/**
 * @route   POST /project
 * @desc    create new project
 * @access  Private
 */
router.post("/project", createProjectValidator, validate, async (req, res) => {
  const Data = { projectName: req.body.projectName };
  const project = await createProject(req, Data);
  if (project.success) {
    return res.success({ ...project });
  } else {
    return res.error({ ...project });
  }
});

/**
 * @route   GET /project/
 * @desc    get projects of user
 * @access  Private
 */

router.get("/project", async (req, res) => {
  const startProject = req.query.startProject || 0;
  const limitProject = req.query.limitProject || 10;

  const projects = await getProjects(req, startProject, limitProject);
  if (projects.success) {
    return res.success({ ...projects });
  } else {
    return res.error({ ...projects });
  }
});

/**
 * @route   GET /project/status
 * @desc    get status of projects of user
 * @access  Private
 */

router.get("/project/status", async (req, res) => {
  const status = await projectStatus(req);
  if (status.success) {
    return res.success({ ...status });
  } else {
    return res.error({ ...status });
  }
});

/**
 * @route   GET /project/:projectID
 * @desc    get project of user. getting whole project data like thumbnail , desc, tittle, etc
 * @access  Private
 */

router.get("/project/:projectID", async (req, res) => {
  const projectID = req.params.projectID;
  const project = await getProjectById(req, projectID);

  if (project.success) {
    return res.success({ ...project });
  } else {
    return res.error({ ...project });
  }
});
/**
 * @route   DELETE /project/:projectID
 * @desc    deleting project
 * @access  Private
 */

router.delete("/project/:projectID", async (req, res) => {
  const projectID = req.params.projectID;
  const project = await deleteProject(req, projectID);

  if (project.success) {
    return res.success({ ...project });
  } else {
    return res.error({ ...project });
  }
});
/**
 * @route   DELETE /project/:projectID/rename
 * @desc    rename project
 * @access  Private
 */

router.patch(
  "/project/:projectID/rename",
  renameProjectValidator,
  validate,
  async (req, res) => {
    const projectID = req.params.projectID;
    const newName = req.body.newName;
    const project = await renameProject(req, { projectID, newName });
    if (project.success) {
      return res.success({ ...project });
    } else {
      return res.error({ ...project });
    }
  },
);

/**
 * @route   POST /project/:projectID/videoDescription
 * @desc    save video description
 * @access  Private
 */

router.post(
  "/project/:projectID/videoDescription",
  saveVideoDescValidator,
  validate,
  async (req, res) => {
    const projectID = req.params.projectID;
    const desc = req.body.description;
    const saveDesc = await saveVideoDesc(req, { projectID, desc });
    if (saveDesc.success) {
      return res.success({ ...saveDesc });
    } else {
      return res.error({ ...saveDesc });
    }
  },
);

/**
 * @route   POST /project/:projectID/customPrompt
 * @desc    save custom Prompt
 * @access  Private
 */

router.post(
  "/project/:projectID/customPrompt",
  saveCustomPromptValidator,
  validate,
  async (req, res) => {
    const projectID = req.params.projectID;
    const prompt = req.body.prompt;
    const savePrompt = await saveCustomPrompt(req, { projectID, prompt });
    if (savePrompt.success) {
      return res.success({ ...savePrompt });
    } else {
      return res.error({ ...savePrompt });
    }
  },
);

/**
 * @route   GET /project/:projectID/content
 * @desc    get project content of user
 * @access  Private
 */

router.get("/project/:projectID/content", async (req, res) => {
  const projectID = req.params.projectID;
  const project = await getContent(req, projectID);
  console.log("project:", project);
  if (project.success) {
    return res.success({ ...project });
  } else {
    return res.error({ ...project });
  }
});

/**
 * @route   GET /project/:projectID/thumbnail
 * @desc    get project thumbnail of user
 * @access  Private
 */

router.get("/project/:projectID/thumbnail", async (req, res) => {
  const projectID = req.params.projectID;
  const thumbnail = await getThumbnail(req, projectID);
  console.log("thumbnail:", thumbnail);
  if (thumbnail.success) {
    return res.success({ ...thumbnail });
  } else {
    return res.error({ ...thumbnail });
  }
});

/**
 * @route   POST /project/
 * @desc    store description of project in db
 * @access  Private
 */
/*
router.post("/project/description",descValidator,validate, async (req, res) => {
  const body = req.body; 
    const description = await handleDescription(req, body);
    if (description.success) {

      return res.success({...description});
    } else {
      return res.error({...description});
    }



});*/
export default router;
