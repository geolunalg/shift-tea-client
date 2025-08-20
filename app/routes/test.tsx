import React, { useState, useEffect } from "react";

export interface Shift {
  id: string
  schedule: string
  staff: Staff[]
}

export interface Staff {
  id: string
  name: string
  days: string[]
}

// Example API response (replace with fetch)
const apiResponse = {
  year: 2025,
  month: 7,
  shifts: [
    {
      id: "d380d303-53eb-4e81-9d14-eca03cddad57",
      startTime: "08:00:00",
      endTime: "12:00:00",
      staff: [
        {
          userId: "4898fe20-f603-40cf-9534-a319112b6baa",
          name: "bruce banner",
          days: [9, 10, 11, 12, 15, 16, 17, 18],
        },
        {
          userId: "7b02966a-7255-41da-a86f-504fff9fc518",
          name: "tony stark",
          days: [1, 2, 3, 4, 7, 8, 9, 10],
        },
      ],
    },
    {
      id: "c59a15d8-2251-4cf6-99ee-dea9e8ecdae4",
      startTime: "12:00:00",
      endTime: "16:00:00",
      staff: [
        {
          userId: "860a4a87-558b-41ce-bd19-edb12df286fa",
          name: "natasha romanoff",
          days: [12, 13, 14, 15, 18, 19, 20, 21],
        },
        {
          userId: "ce464ad3-6de5-45a0-8ab7-c2bd22d89247",
          name: "steve rogers",
          days: [16, 17, 18, 19, 22, 23, 24, 25],
        },
      ],
    },
  ],
};

function Playground() {
  const daysOfMonth = new Date(2025, apiResponse.month, 0).getDate();
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const [shifts, setShifts] = useState<Shift[]>([]);

  // Load API into shifts structure
  useEffect(() => {
    const shifts: Shift[] = apiResponse.shifts.map((shift) => {
      const staff: Staff[] = shift.staff.map((s) => {
        const daysArr = Array(daysOfMonth).fill("");
        s.days.forEach((d) => {
          if (d <= daysOfMonth) daysArr[d - 1] = "x";
        });
        return {
          id: s.userId,
          name: s.name,
          days: daysArr,
        };
      });
      return {
        id: shift.id,
        schedule: `${shift.startTime.slice(0, 5)} - ${shift.endTime.slice(0, 5)}`,
        staff,
      };
    });
    setShifts(shifts);
  }, []);

  // === Shift actions ===
  const addShift = () => {
    setShifts([
      ...shifts,
      {
        id: `shift-${Date.now()}`,
        schedule: "New Shift",
        staff: [],
      },
    ]);
  };

  const deleteShift = (shiftId: string) => {
    setShifts(shifts.filter((s) => s.id !== shiftId));
  };

  const updateShiftLabel = (shiftId: string, value: string) => {
    setShifts(
      shifts.map((s) =>
        s.id === shiftId ? { ...s, label: value } : s
      )
    );
  };

  // === Staff actions ===
  const addStaff = (shiftId: string) => {
    setShifts(
      shifts.map((s) =>
        s.id === shiftId
          ? {
            ...s,
            staff: [
              ...s.staff,
              {
                id: `staff-${Date.now()}`,
                name: "",
                days: Array(daysOfMonth).fill(""),
              },
            ],
          }
          : s
      )
    );
  };

  const deleteStaff = (shiftId: string, staffId: string) => {
    setShifts(
      shifts.map((s) =>
        s.id === shiftId
          ? { ...s, staff: s.staff.filter((st) => st.id !== staffId) }
          : s
      )
    );
  };

  const updateStaffLabel = (shiftId: string, staffId: string, value: string) => {
    setShifts(
      shifts.map((s) =>
        s.id === shiftId
          ? {
            ...s,
            staff: s.staff.map((st) =>
              st.id === staffId ? { ...st, label: value } : st
            ),
          }
          : s
      )
    );
  };

  const updateDay = (shiftId: string, staffId: string, dayIndex: number, value: string) => {
    setShifts(
      shifts.map((s) =>
        s.id === shiftId
          ? {
            ...s,
            staff: s.staff.map((st) =>
              st.id === staffId
                ? {
                  ...st,
                  days: st.days.map((d, i) =>
                    i === dayIndex ? value.slice(0, 1) : d
                  ),
                }
                : st
            ),
          }
          : s
      )
    );
  };

  return (
    <>
      {/* <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-6xl space-y-4"> */}
      {/* Add Shift Button */}
      <div className="flex gap-2">
        <button
          onClick={addShift}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          + Add Shift
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-400 w-full text-sm text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-400 px-2 py-1">NAME / SHIFT</th>
              {[...Array(daysOfMonth)].map((_, i) => {
                const day = i + 1;
                const dow = new Date(
                  apiResponse.year,
                  apiResponse.month - 1,
                  day
                ).getDay();
                return (
                  <th
                    key={day}
                    className="border border-gray-400 px-2 py-1 text-center"
                  >
                    {day}
                    <br />
                    {daysOfWeek[dow]}
                  </th>
                );
              })}
              <th className="border border-gray-400 px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <React.Fragment key={shift.id}>
                {/* Shift row */}
                <tr className="bg-gray-100 font-bold">
                  <td className="border border-gray-400 px-2 py-1">
                    <input
                      type="text"
                      value={shift.schedule}
                      onChange={(e) =>
                        updateShiftLabel(shift.id, e.target.value)
                      }
                      className="w-full px-1 py-0.5 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </td>
                  {[...Array(daysOfMonth)].map((_, i) => (
                    <td
                      key={i}
                      className="border border-gray-400 px-2 py-1 text-center bg-gray-50"
                    ></td>
                  ))}
                  <td className="border border-gray-400 px-2 py-1 text-center">
                    <button
                      onClick={() => addStaff(shift.id)}
                      className="px-2 py-1 bg-blue-500 text-white rounded mr-1"
                    >
                      + Staff
                    </button>
                    <button
                      onClick={() => deleteShift(shift.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      ✕
                    </button>
                  </td>
                </tr>

                {/* Staff rows */}
                {shift.staff.map((staff) => (
                  <tr key={staff.id}>
                    <td className="border border-gray-400 px-2 py-1">
                      <input
                        type="text"
                        value={staff.name}
                        onChange={(e) =>
                          updateStaffLabel(shift.id, staff.id, e.target.value)
                        }
                        placeholder="Enter name..."
                        className="w-full px-1 py-0.5 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </td>
                    {staff.days.map((val, i) => (
                      <td
                        key={i}
                        className="border border-gray-400 px-2 py-1 text-center"
                      >
                        <input
                          type="text"
                          value={val}
                          maxLength={1}
                          onChange={(e) =>
                            updateDay(shift.id, staff.id, i, e.target.value)
                          }
                          className="w-6 text-center border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                      </td>
                    ))}
                    <td className="border border-gray-400 px-2 py-1 text-center">
                      <button
                        onClick={() => deleteStaff(shift.id, staff.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {/* </div>
      </div> */}
    </>
  );
}

export default function TestFunc() {
  return <Playground />;
}
