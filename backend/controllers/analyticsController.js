import Employee from '../models/EmployeeModel.js'; // Assuming tasks are part of the Employee model

export const getTaskAnalytics = async (req, res) => {
  try {
    const pipeline = [
      // Stage 1: Unwind the tasks array to get a document for each task
      {
        $unwind: '$tasks',
      },
      // Stage 2: Group by the task's status and count them
      {
        $group: {
          _id: '$tasks.status',
          count: { $sum: 1 },
        },
      },
      // Stage 3: Project the output to a more readable format
      {
        $project: {
          _id: 0, // Exclude the default _id
          name: '$_id',
          count: '$count',
        },
      },
    ];

    const taskStatusData = await Employee.aggregate(pipeline);

    // Fetching data for the second chart (Tasks by Department)
    const departmentData = await Employee.aggregate([
      // Stage 1: Unwind the tasks array
      { $unwind: '$tasks' },
      // Stage 2: Group by department and count the tasks
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
      // Stage 3: Project into a clean format
      {
        $project: {
          _id: 0,
          name: '$_id',
          value: '$count',
        },
      },
    ]);

    res.status(200).json({
      taskStatusData,
      departmentData,
    });
  } catch (error) {
    console.error("Failed to fetch analytics data:", error);
    res.status(500).json({ message: 'Failed to fetch analytics data' });
  }
};
