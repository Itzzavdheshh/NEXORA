const handleSupabaseError = (error) => {
  if (!error) return;

  switch (error.code) {
    case "23505":
      throw new Error("This record already exists.");

    case "23503":
      throw new Error("Referenced record does not exist.");

    case "22P02":
      throw new Error("Invalid ID or invalid data format.");

    case "PGRST116":
      throw new Error("Record not found.");

    default:
      throw new Error(error.message);
  }
};

module.exports = handleSupabaseError;