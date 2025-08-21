import React, { useState, useEffect } from "react";

export interface Shift {
  id: string;
  schedule: string;
  staff: Staff[];
}

export interface Staff {
  id: string;
  name: string;
  days: string[];
}

const apiAllStaffSampleResponse = [
  {
    userId: "4898fe20-f603-40cf-9534-a319112b6baa",
    name: "bruce banner"
  },
  {
    userId: "7b02966a-7255-41da-a86f-504fff9fc518",
    name: "tony stark"
  },
  {
    userId: "860a4a87-558b-41ce-bd19-edb12df286fa",
    name: "natasha romanoff"
  },
  {
    userId: "ce464ad3-6de5-45a0-8ab7-c2bd22d89247",
    name: "steve rogers"
  }
]

// Example API response (replace with fetch)
const apiShiftsSampleResponse = {
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

function StaffInput({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (id: string, name: string) => void;
}) {
  const [query, setQuery] = useState(value);
  const [showOptions, setShowOptions] = useState(false);

  // Filter available staff
  const filtered = apiAllStaffSampleResponse.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (staff: { userId: string; name: string }) => {
    setQuery(staff.name);
    onSelect(staff.userId, staff.name);
    setShowOptions(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowOptions(true);
        }}
        onFocus={() => setShowOptions(true)}
        onBlur={() => setTimeout(() => setShowOptions(false), 150)}
        placeholder="Select staff..."
        className="w-full px-1 py-0.5 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
      />

      {showOptions && filtered.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto border border-gray-300 bg-white rounded shadow-lg z-10">
          {filtered.map((s) => (
            <li
              key={s.userId}
              onMouseDown={() => handleSelect(s)} // prevent blur removing dropdown
              className="px-2 py-1 cursor-pointer hover:bg-blue-100"
            >
              {s.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ScheduleForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const daysOfMonth = new Date(
    apiShiftsSampleResponse.year,
    apiShiftsSampleResponse.month,
    0,
  ).getDate();
  const abbDaysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const [shifts, setShifts] = useState<Shift[]>([]);

  // Load API into shifts structure
  useEffect(() => {
    const shifts: Shift[] = apiShiftsSampleResponse.shifts.map((shift) => {
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
      shifts.map((s) => (s.id === shiftId ? { ...s, schedule: value } : s)),
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
                id: "", // will be set once user selects a real staff
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
          : s,
      ),
    );
  };

  const updateStaffLabel = (
    shiftId: string,
    staffId: string,
    value: string,
  ) => {
    setShifts(
      shifts.map((s) =>
        s.id === shiftId
          ? {
            ...s,
            staff: s.staff.map((st) =>
              st.id === staffId ? { ...st, name: value } : st,
            ),
          }
          : s,
      ),
    );
  };

  const updateDay = (
    shiftId: string,
    staffId: string,
    dayIndex: number,
    value: string,
  ) => {
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
                    i === dayIndex ? value.slice(0, 1) : d,
                  ),
                }
                : st,
            ),
          }
          : s,
      ),
    );
  };

  return (
    <>
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
                const abbdow = new Date(
                  apiShiftsSampleResponse.year,
                  apiShiftsSampleResponse.month - 1,
                  day,
                ).getDay();
                return (
                  <th
                    key={day}
                    className="border border-gray-400 px-2 py-1 text-center"
                  >
                    {day}
                    <br />
                    {abbDaysOfWeek[abbdow]}
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


                      <StaffInput
                        value={staff.name}
                        onSelect={(userId, name) =>
                          setShifts(
                            shifts.map((s) =>
                              s.id === shift.id
                                ? {
                                  ...s,
                                  staff: s.staff.map((st) =>
                                    st.id === staff.id || st.id === ""  // match either temp row or exact row
                                      ? { ...st, id: userId, name }
                                      : st
                                  ),
                                }
                                : s
                            )
                          )
                        }
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
    </>
  );
}

