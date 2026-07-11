const {
  fetchStats,
  fetchUsers,
  modifyUserStatus,
} = require("../services/admin.service");

const getDashboardStats = async (req, res) => {
  try {
    const stats = await fetchStats();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const listUsers = async (req, res) => {
  try {
    const { search, role, status, verified, sort, page, limit } = req.query;

    const result = await fetchUsers({
      search: search || "",
      role: role || "all",
      status: status || "all",
      verified: verified || "all",
      sort: sort || "newest",
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });

    return res.status(200).json({
      success: true,
      data: result.users,
      pagination: {
        total: result.totalCount,
        page: result.page,
        limit: result.limit,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status field is required.",
      });
    }

    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: "Administrators cannot modify their own account status.",
      });
    }

    const user = await modifyUserStatus(id, status);

    return res.status(200).json({
      success: true,
      message: `User status successfully updated to ${status}.`,
      data: user,
    });
  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  listUsers,
  updateUserStatus,
};
