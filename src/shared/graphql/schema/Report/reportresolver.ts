import { ReportModel } from "../../../database/model/user.report";
import { usermodel } from "../../../database/model/user.model";
import { vendorModel } from "../../../database/model/vendor.model";

enum ReporterType {
  user = "user",
  vendor = "vendor"
}

export const reportResolver = {
  Query: {
    // Get all reports (Admin use)
    async getReports() {
      try {
        return await ReportModel.find().sort({ createdAt: -1 }).exec();
      } catch (err) {
        throw new Error("Failed to fetch reports");
      }
    },

    // Get reports by a specific user
    async getReportsByUser(_: any, { username }: { username: string }) {
      try {
        return await ReportModel.find({ reportedBy: username })
          .sort({ createdAt: -1 })
          .exec();
      } catch (err) {
        throw new Error("Failed to fetch user reports");
      }
    },

    // Get a single report by ID
    async getReportById(_: any, { reportId }: { reportId: string }) {
      try {
        return await ReportModel.findById(reportId);
      } catch (err) {
        throw new Error("Failed to fetch report");
      }
    },

    // Get reports by target (user or vendor)
    async getReportsByTarget(_: any, { targetId }: { targetId: string }) {
      try {
        return await ReportModel.find({ reportedId: targetId })
          .sort({ createdAt: -1 })
          .exec();
      } catch (err) {
        throw new Error("Failed to fetch target reports");
      }
    },
  },

  Mutation: {
    // Create a new report (default status = PENDING)
    async sendReport(_: any, { reportType, targetId, targetName, reason, reportedBy, reporterType }: any) {
      try {
        console.log("Received report submission:", { reportType, targetId, targetName, reason, reportedBy, reporterType });
        
        // Validate that the target exists
        let targetExists = false;
        
        if (reportType === "user") {
          const user = await usermodel.findById(targetId);
          targetExists = !!user;
          console.log("User target check:", { targetId, userExists: targetExists });
        } else if (reportType === "vendor") {
          const vendor = await vendorModel.findById(targetId);
          targetExists = !!vendor;
          console.log("Vendor target check:", { targetId, vendorExists: targetExists });
        }

        if (!targetExists) {
          console.log("Target not found error");
          throw new Error("Target account not found");
        }

        const newReport = new ReportModel({
          reportType,
          reportedId: targetId, // Store as reportedId in database
          targetName,
          reason: reason || "Report submitted", // Default reason if not provided
          reportedBy,
reporterType: reporterType || ReporterType.user, // user or vendor
          status: "pending", // Use lowercase to match database enum
        });

        console.log("Creating new report:", newReport);
        await newReport.save();
        console.log("Report saved successfully:", newReport._id);
        return newReport;
      } catch (err) {
        console.error("Error in sendReport:", err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        throw new Error("Failed to send report: " + errorMessage);
      }
    },

    // Admin updates report status
    async updateReportStatus(_: any, { reportId, status }: { reportId: string; status: string }) {
      try {
        const report = await ReportModel.findById(reportId);
        if (!report) throw new Error("Report not found");

        report.status = status.toLowerCase(); // Convert to lowercase to match database enum
        report.updatedAt = new Date();

        await report.save();
        return report;
      } catch (err) {
        throw new Error("Failed to update report status");
      }
    },

    // Admin replies to report
    async replyToReport(_: any, { reportId, replyMessage }: { reportId: string; replyMessage: string }) {
      try {
        const report = await ReportModel.findById(reportId);
        if (!report) throw new Error("Report not found");

        report.adminReply = replyMessage;
        report.status = "reviewed"; // Use lowercase to match database enum
        report.updatedAt = new Date();

        await report.save();
        return report;
      } catch (err) {
        throw new Error("Failed to reply to report");
      }
    },
  },
};
