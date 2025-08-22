import React, { useState, useEffect } from "react";

const token = "YOUR_JWT_TOKEN"; // keep this safe!

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

async function getAllStaff() {
  const res = await fetch("/api/v1/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.ok) return res.json();
  const err = await res.json();
  throw new Error(`Failed to get users: ${err.error}`);
}

async function getScheduleShifts(year?: number, month?: number) {
  let url = "/api/v1/shifts";
  if (year && month) {
    url += `?year=${year}&month=${month}`;
  }

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.ok) return res.json();
  const err = await res.json();
  throw new Error(`Failed to get shifts: ${err.error}`);
}

function buildSchedulePayload(year: number, month: number, shifts: Shift[]) {
  return {
    year,
    month,
    shifts: shifts.map((shift) => {
      const [startTime, endTime] = shift.schedule.split(" - ");

      return {
        startTime,
        endTime,
        staff: shift.staff.map((st) => {
          const days: number[] = st.days
            .map((d, i) => (d ? i + 1 : null)) // if marked, return day number
            .filter((d): d is number => d !== null); // remove nulls

          return {
            userId: st.id,
            days,
          };
        }),
      };
    }),
  };
}

async function saveSchedule(year: number, month: number, shifts: Shift[]) {
  const payload = buildSchedulePayload(year, month, shifts);

  const res = await fetch("/api/v1/shifts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Failed to save scheduel: ${err.error}`);
    return;
  }

  const data = await res.json();
  if (data.failed > 0) {
    throw new Error("Unable to set all schedules");
  }
}

function StaffInput({
  value,
  onSelect,
  staffOptions,
}: {
  value: string;
  onSelect: (id: string, name: string) => void;
  staffOptions: { userId: string; name: string }[];
}) {
  const [query, setQuery] = useState(value);
  const [showOptions, setShowOptions] = useState(false);

  const filtered = staffOptions.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()),
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
              onMouseDown={() => handleSelect(s)}
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

export function ScheduleForm() {
  const [staffOptions, setStaffOptions] = useState<
    { userId: string; name: string }[]
  >([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);

  const abbDaysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const daysOfMonth = new Date(year, month, 0).getDate();

  // Fetch staff on mount
  useEffect(() => {
    getAllStaff()
      .then(setStaffOptions)
      .catch((err) => console.error(err));
  }, []);

  // Fetch shifts whenever year or month changes
  useEffect(() => {
    async function loadShifts() {
      try {
        const shiftsRes = await getScheduleShifts(year, month);

        // Update year & month from backend response (in case they differ)
        setYear(shiftsRes.year);
        setMonth(shiftsRes.month);

        const daysOfMonth = new Date(
          shiftsRes.year,
          shiftsRes.month,
          0,
        ).getDate();

        const normalizedShifts: Shift[] = shiftsRes.shifts.map((shift: any) => {
          const staff: Staff[] = shift.staff.map((s: any) => {
            const daysArr = Array(daysOfMonth).fill("");
            s.days.forEach((d: number) => {
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
            schedule: `${shift.startTime.slice(0, 5)} - ${shift.endTime.slice(
              0,
              5,
            )}`,
            staff,
          };
        });

        setShifts(normalizedShifts);
      } catch (err) {
        console.error(err);
      }
    }
    loadShifts();
  }, [year, month]);

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

  const addStaff = (shiftId: string) => {
    setShifts(
      shifts.map((s) =>
        s.id === shiftId
          ? {
              ...s,
              staff: [
                ...s.staff,
                {
                  id: "",
                  name: "",
                  days: Array(daysOfMonth).fill(""),
                },
              ],
            }
          : s,
      ),
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
      {/* Controls */}
      <div className="flex gap-4 mb-4 items-center">
        <button
          onClick={addShift}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          + Add Shift
        </button>

        {/* Year Selector */}
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border px-2 py-1 rounded"
        >
          {Array.from({ length: 5 }, (_, i) => year - 2 + i).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* Month Selector */}
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border px-2 py-1 rounded"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {new Date(0, m - 1).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
      </div>

      {/* Save schedule */}
      <button
        onClick={() => saveSchedule(year, month, shifts)}
        className="px-3 py-1 bg-green-600 text-white rounded"
      >
        💾 Save Schedule
      </button>

      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-400 w-full text-sm text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-400 px-2 py-1">NAME / SHIFT</th>
              {[...Array(daysOfMonth)].map((_, i) => {
                const day = i + 1;
                const abbdow = new Date(year, month - 1, day).getDay();
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
                  <tr key={staff.id || Math.random()}>
                    <td className="border border-gray-400 px-2 py-1">
                      <StaffInput
                        value={staff.name}
                        staffOptions={staffOptions}
                        onSelect={(userId, name) =>
                          setShifts(
                            shifts.map((s) =>
                              s.id === shift.id
                                ? {
                                    ...s,
                                    staff: s.staff.map((st) =>
                                      st.id === staff.id || st.id === ""
                                        ? { ...st, id: userId, name }
                                        : st,
                                    ),
                                  }
                                : s,
                            ),
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
