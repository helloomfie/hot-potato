// archive.js
export const archiveTask = async (task, completionData) => {
  // Mock implementation - in a real app this would save to a database
  console.log('Task archived:', task.title, completionData);
  return Promise.resolve();
};

export const getArchivedTasks = async () => {
  // Mock implementation - return empty array for now
  return Promise.resolve([]);
};