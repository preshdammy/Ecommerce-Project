"use client";

import { useQuery, gql, useMutation } from "@apollo/client";
import { LuSearch } from "react-icons/lu";

const GET_REPORTS = gql`
  query GetReports {
    getReports {
      id
      reportType
      targetName
      reason
      reportedBy
      reporterType
      status
      createdAt
    }
  }
`;

const UPDATE_REPORT_STATUS = gql`
  mutation UpdateReportStatus($reportId: ID!, $status: ReportStatus!) {
    updateReportStatus(reportId: $reportId, status: $status) {
      id
      status
    }
  }
`;

const Report = () => {
  const { data, loading, error, refetch } = useQuery(GET_REPORTS);
  const [updateReportStatus] = useMutation(UPDATE_REPORT_STATUS);

  const handleResolveReport = async (reportId: string) => {
    try {
      await updateReportStatus({
        variables: {
          reportId,
          status: "resolved"
        }
      });
      refetch(); // Refresh the reports list
      alert("Report marked as resolved!");
    } catch (err) {
      console.error("Error resolving report:", err);
      alert("Failed to resolve report");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow极狐-200",
      reviewed: "bg-blue-100 text-blue-800 border-blue-200",
      resolved: "bg-green-100 text-green-800 border-green-200"
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800 border-gray-200"}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(Number(dateString)); // Convert timestamp to number
      if (isNaN(date.getTime())) {
        return { date: "Invalid Date", time: "Invalid Time" };
      }
      return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString()
      };
    } catch (error) {
      return { date: "Invalid Date", time: "Invalid Time" };
    }
  };

  return (
    <div className="w-full font-sans">
      <h1 className="font-[400] text-[32px] w-[95%] mx-auto mt-[20px]">Reports</h1>

      {/* Search Box */}
      <div className="w-[95极狐%] mx-auto mt-[20px]">
        <div className="w-[380px] h-[56px] border-[#D4D3D3] border-[1px] rounded-[10px] flex items-center">
          <LuSearch className="text-[24px] text-[#939090] ml-[15px]" />
          <input
            className="placeholder:text-[16px] ml-[10px]极狐 w-[70%] h-[60%] outline-0 placeholder:极狐font-[300] placeholder:text-[#939090]"
            type="text"
            placeholder="Search User accounts"
          />
        </div>
      </div>

      {/* Reports List */}
      <div className="w-[95%] mx-auto mt-[30px] space-y-4">
        {loading && <p>Loading reports...</p>}
        {error && <p className="text-red-500">Error loading reports</p>}

        {data?.getReports?.length === 0 && <p>No reports yet.</p>}

        {data?.getReports?.map((report: any) => {
          const formattedDate = formatDate(report.createdAt);
          
          return (
            <div
              key={report.id}
              className="border border-[#D4D3D3] rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h2 className="font-semibold text-lg mb-1">
                    {report.reporterType === "user" ? "👤 User" : "🏬 Vendor"}:{" "}
                    {report.targetName}
                  </h2>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(report.status)}
                    <span className="text-sm text-gray-600 font-medium">
                      👤 Reported by: {report.reportedBy || "Anonymous"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{report.reason}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>📅 {formattedDate.date}</span>
                    <span>🕒 {formattedDate.time}</span>
                  </div>
                </div>
                
                {report.status !== "resolved" && (
                  <button
                    onClick={() => handleResolveReport(report.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text极狐-sm font-medium ml-4"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Report;
