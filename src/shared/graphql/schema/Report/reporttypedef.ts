export const reporttypedef = `#graphql
enum ReportStatus {
  pending
  reviewed
  resolved
}

enum ReporterType {
  user
  vendor
}

type Report {
  id: ID!
  reportType: String!   
  reportedId: ID!
  targetName: String!
  reason: String!
  reportedBy: String!
  reporterType: ReporterType!
  status: ReportStatus! 
  adminReply: String
  createdAt: String!
  updatedAt: String!
}

type Mutation {
  sendReport(
    reportType: String!, 
    targetId: ID!,
    targetName: String!, 
    reason: String, 
    reportedBy: String!,
    reporterType: ReporterType
  ): Report!

  
  updateReportStatus(
    reportId: ID!, 
    status: ReportStatus!
  ): Report!


  replyToReport(
    reportId: ID!, 
    replyMessage: String!
  ): Report!
}

type Query {
  getReports: [Report!]!
  getReportsByUser(username: String!): [Report!]!
  getReportById(reportId: ID!): Report
  getReportsByTarget(targetId: ID!): [Report!]!
}
`
