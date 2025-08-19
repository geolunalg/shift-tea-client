import { Command } from "cmdk";
import React from "react";

function Playground() {
  const daysOfMonth = new Date(2025, 7, 0).getDate();
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">

        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-400 w-full text-sm text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-400 px-2 py-1">NAME</th>
                {[...Array(daysOfMonth)].map((_, i) => {
                  const day = i + 1
                  const dow = new Date(2025, 7, day).getDay()
                  return <th className="border border-gray-400 px-2 py-1">
                    {day}
                    <br />
                    {daysOfWeek[dow]}
                  </th>
                })}
              </tr>
            </thead>
            <tbody>
              {/* schedule row */}
              <tr>
                <td className="border border-gray-400 px-2 py-1">
                  8:00 am - 12:00 pm
                </td>
                {[...Array(daysOfMonth)].map((_, i) => {
                  return <td className="border border-gray-400 px-2 py-1"></td>
                })}
              </tr>
              {/* staff rows */}
              <tr>
                <td className="border border-gray-400 px-2 py-1">
                  Steve Rogers
                </td>
                {[...Array(daysOfMonth)].map((_, i) => {
                  return <td className="border border-gray-400 px-2 py-1"></td>
                })}
              </tr>
              <tr>
                <td className="border border-gray-400 px-2 py-1">Tony Stark</td>
                {[...Array(daysOfMonth)].map((_, i) => {
                  return <td className="border border-gray-400 px-2 py-1"></td>
                })}
              </tr>
              <tr>
                <td className="border border-gray-400 px-2 py-1">
                  Natasha Romanoff
                </td>
                {[...Array(daysOfMonth)].map((_, i) => {
                  return <td className="border border-gray-400 px-2 py-1"></td>
                })}
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default function TestFunc() {
  return <Playground />;
}
