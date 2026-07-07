export function createZodResolver(schema) {
  return async (values) => {
    const result = schema.safeParse(values);

    if (result.success) {
      return {
        values: result.data,
        errors: {},
      };
    }

    const errors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (!field || errors[field]) continue;

      errors[field] = {
        type: issue.code,
        message: issue.message,
      };
    }

    return {
      values: {},
      errors,
    };
  };
}
