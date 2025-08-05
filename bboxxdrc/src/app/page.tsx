"use client";

import HeaderComponent from "@/app/header/Header";
import { IDonner } from "@/app/interface/IOther";
import Loading from "@/app/Tools/loading";
import _ from "lodash";
import React from "react";

function page() {
  const [data, setData] = React.useState<IDonner>();
  const [load, setLoad] = React.useState<boolean>(true);

  const loading = async () => {
    setLoad(true);
    try {
      const res = await fetch("/api/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      setData(result.data);
      setLoad(false);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    loading();
  }, []);

  return (
    <HeaderComponent title="Dashboard">
      {load && !data ? (
        <Loading type="Loading" />
      ) : (
        <div className="flex flex-col gap-6 p-4">
          {/* Table responsive */}

          {/* Grille responsive des sections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Fraud management */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Action</th>
                  <th>Decision</th>
                </tr>
              </thead>
              {data && (
                <tbody>
                  {data?.regions.map((region, key) => (
                    <React.Fragment key={key}>
                      <tr className=" font-semibold bg-gray-400">
                        <td>{region}</td>
                        <td>
                          {_.sumBy(
                            data.act_decisions.filter(
                              (x) => x.region === region
                            ),
                            "action"
                          )}
                        </td>
                        <td>
                          {_.sumBy(
                            data.act_decisions.filter(
                              (x) => x.region === region
                            ),
                            "decision"
                          )}
                        </td>
                      </tr>
                      {data.act_decisions
                        .filter((x) => x.region === region)
                        .map((shop, cle) => (
                          <tr key={cle}>
                            <td>{shop.shop}</td>
                            <td>{shop.action}</td>
                            <td>{shop.decision}</td>
                          </tr>
                        ))}
                    </React.Fragment>
                  ))}

                  <tr>
                    <td>Total</td>
                    <td>{_.sumBy(data.act_decisions, "action")}</td>
                    <td>{_.sumBy(data.act_decisions, "decision")}</td>
                  </tr>
                </tbody>
              )}
            </table>
            <div className="border rounded-xl p-4 shadow-sm ">
              <p className="text-lg font-semibold mb-2 text-center">
                Fraud Management
              </p>
              <div>
                <p className="text-sm text-gray-600 text-center">Validation</p>
                <p className="text-3xl font-bold text-center">
                  {data?.validationFraude}
                </p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 text-center">
                  Awaiting verification
                </p>
                <p className="text-3xl font-bold text-center">
                  {data?.awaiting_fraudes}
                </p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 text-center">
                  Household visits
                </p>
                <p className="text-3xl font-bold text-center">{data?.vmpo}</p>
              </div>
            </div>

            {/* Field management */}
            <div className="border rounded-xl p-4 shadow-sm ">
              <p className="text-lg font-semibold mb-2 text-center">
                Field Management
              </p>
              <div>
                <p className="text-sm text-gray-600 text-center">Validation</p>
                <p className="text-3xl font-bold text-center">
                  {data?.validationField}
                </p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 text-center">
                  Awaiting verification
                </p>
                <p className="text-3xl font-bold text-center">
                  {data?.awaiting_fields}
                </p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 text-center ">
                  Household visits
                </p>
                <p className="text-3xl font-bold text-center">
                  {data?.vmfield}
                </p>
              </div>
            </div>

            {/* Feedback */}
            <div className="border rounded-xl p-4 shadow-sm  col-span-1 sm:col-span-2 lg:col-span-1 flex flex-col justify-center items-center">
              <p className="text-lg font-semibold mb-2">Feedback to Refresh</p>
              <p className="text-4xl font-bold">{data?.refresh}</p>
            </div>
          </div>
        </div>
      )}
    </HeaderComponent>
  );
}

export default page;
