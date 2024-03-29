const Utils = require('../utils/common-utils');

const getProjectDetails = async (dir = process.cwd()) => {
  const pJson = await Utils.getPackageJson(dir);

  if (!pJson) {
    return { project: {} };
  }

  return {
    project: pJson
  };
};

const createProject = async (projectDetails, dir = process.cwd()) => {
    return;
};


const projectController = {
  getProjectDetails,
  createProject
};

module.exports = projectController;
