// "use client"; // Ensure this is a client component

// import React from 'react';
// import { useRouter } from 'next/navigation';

// const ComplaintsTable = () => {
//   const router = useRouter();

//   const handleRowClick = (id : any) => {
//     router.push(`/user/${id}`);
//   };

//   const complaints = [
//     { id: 123, pnr: 22, complaint: 'text', date: '23/01/22', status: 'Resolved' },
//     { id: 233, pnr: 32, complaint: 'text', date: '21/01/21', status: 'Pending' },
//     { id: 334, pnr: 23, complaint: 'text', date: '08/11/23', status: 'Resolved' },
//     { id: 4334, pnr: 11, complaint: 'text', date: '09/12/24', status: 'Resolved' },
//   ];

//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full bg-white border border-gray-300">
//         <thead className="bg-gray-200">
//           <tr>
//             <th className="py-2 px-4 border-b">Problem ID</th>
//             <th className="py-2 px-4 border-b">PNR</th>
//             <th className="py-2 px-4 border-b">Complaint</th>
//             <th className="py-2 px-4 border-b">Date</th>
//             <th className="py-2 px-4 border-b">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {complaints.map((complaint) => (
//             <tr
//               key={complaint.id}
//               onClick={() => handleRowClick(complaint.id)}
//               className="cursor-pointer hover:bg-gray-100"
//             >
//               <td className="py-2 px-4 border-b">{complaint.id}</td>
//               <td className="py-2 px-4 border-b">{complaint.pnr}</td>
//               <td className="py-2 px-4 border-b">{complaint.complaint}</td>
//               <td className="py-2 px-4 border-b">{complaint.date}</td>
//               <td className="py-2 px-4 border-b">{complaint.status}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ComplaintsTable;


// src/components/ComplaintsTable.tsx
"use client";

import React from 'react';

interface Complaint {
  userId: string;
  problemId: string;
  mobileNo: string;
  complaintText: string;
  date: string;
  severity?: 'High' | 'Mid' | 'Low';
  grievanceDescription?: string;
  status?: string;
  fileUrl?: string;
  pnr?: string;
}

const ComplaintsTable = ({ complaints, onComplaintClick }: { complaints: Complaint[], onComplaintClick: (complaint: Complaint) => void }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="border-b border-gray-300 py-2 px-4 text-left">Problem ID</th>
            <th className="border-b border-gray-300 py-2 px-4 text-left">Mobile No</th>
            <th className="border-b border-gray-300 py-2 px-4 text-left">Complaint</th>
            <th className="border-b border-gray-300 py-2 px-4 text-left">Date</th>
            <th className="border-b border-gray-300 py-2 px-4 text-left">Severity</th>
            <th className="border-b border-gray-300 py-2 px-4 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr
              key={complaint.problemId}
              onClick={() => onComplaintClick(complaint)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="border-b border-gray-300 py-2 px-4">{complaint.problemId}</td>
              <td className="border-b border-gray-300 py-2 px-4">{complaint.mobileNo}</td>
              <td className="border-b border-gray-300 py-2 px-4">
              <span
  className="text-blue-600 hover:underline"
>
  {(() => {
    const words = complaint.complaintText.split(' ');
    if (words.length > 4) {
      return `${words.slice(0, 4).join(' ')}...`;
    }
    return complaint.complaintText;
  })()}
</span>

              </td>
              <td className="border-b border-gray-300 py-2 px-4">{complaint.date}</td>
              <td className="border-b border-gray-300 py-2 px-4">
                <span
                  className={`px-2 py-1 rounded-full border ${
                    complaint.severity === 'High'
                      ? 'text-red-500 border-red-500'
                      : complaint.severity === 'Mid'
                      ? 'text-yellow-500 border-yellow-500'
                      : 'text-green-500 border-green-500'
                  }`}
                >
                  {complaint.severity || 'N/A'}
                </span>
              </td>
              <td className="border-b border-gray-300 py-2 px-4">
                {complaint.status || 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintsTable;
