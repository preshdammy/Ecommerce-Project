export const reportresolver = {
    Mutation: {
  reportAccount: async (_: any, { input }: any, context: any) => {
    const { type, name, reason, description } = input;

    try {
      // 🔒 Optionally only allow authenticated users:
      if (!context.admin && !context.user && !context.vendor) {
        throw new Error("Unauthorized");
      }

      // 🔔 You can log, email, or save to DB
      console.log(" Report Received:", {
        type,
        name,
        reason,
        description,
        reportedBy: context.admin ?? context.vendor ?? context.user,
      });

      // You can also send email to admin or save to DB here

      return true;
    } catch (error) {
      console.error("Error in reportAccount:", error);
      return false;
    }
  },
},

}
