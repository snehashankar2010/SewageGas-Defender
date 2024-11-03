import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/UserContext";
import { useParams, useNavigate } from "react-router-dom";

import axios from "../../config/axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-luxon";
import ChartStreaming from "chartjs-plugin-streaming";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import DeleteConfirmDialog from "./../../components/DeleteConfirmDialog/DeleteConfirmDialog";
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
  ChartStreaming,
  annotationPlugin
);

const DevicePage = () => {
  const { deviceId } = useParams();
  const navigate = useNavigate();

  const { user, _ } = useContext(UserContext);
  const [device, setDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  // Temperature Data
  const [data, setData] = useState([]);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);

  useEffect(() => {
    // Check if deviceId is in user.devices
    // If not, redirect to 404
    if (!user) return;
    let found = user.devices.filter((device) => device._id === deviceId);
    if (found.length == 0) {
      navigate("/404", { replace: true });
      return;
    }
    setDevice(found[0]);
  }, [user, deviceId]);

  // Load initial data
  useEffect(() => {
    if (!device || !device._id) return;
    axios.get(`/device/${deviceId}/read/${device.readKey}`).then((res) => {
      if (res.success) setData(res.values || []);
    });
  }, [device]);

  useEffect(() => {
    let interval = setInterval(() => {
      if (!device || !device._id) return;
      axios
        .get(`/device/${deviceId}/read/${device.readKey}?skip=${data.length}`)
        .then((res) => {
          console.log("Fetching new data...");
          if (res.success && res.isConnected) {
            setIsConnected(true);
          } else setIsConnected(false);
          if (res.success && res.values && res.values.length > 0) {
            let newData = [...data, ...res.values];
            // limit to 86400 values
            if (newData.length > 86400) {
              newData = newData.slice(newData.length - 86400);
            }
            setData(newData);
          }
        });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [data]);

  const copyReadKey = () => {
    if (!device) alert("Error!");
    navigator.clipboard.writeText(device.readKey);
    alert("Read Key copied to clipboard");
  };
  const copyWriteKey = () => {
    if (!device) alert("Error!");
    navigator.clipboard.writeText(device.writeKey);
    alert("Write Key copied to clipboard");
  };

  if (!device) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <h1 className="mb-2 text-4xl font-semibold">Loading...</h1>
        <h2 className="text-xl">This will only take a moment</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-grow flex-col items-center">
      <DeleteConfirmDialog
        isOpen={showDeleteConfirmDialog}
        setIsOpen={setShowDeleteConfirmDialog}
        device={device}
      />
      <main className="w-full max-w-7xl flex-grow p-2 pt-4">
        <div className="relative flex-grow items-start justify-start space-x-2 px-5 py-5 md:flex md:flex-row">
          <main className="mt-4 w-full space-y-4 md:mt-0 md:flex-grow">
            <div className="overflow-hidden rounded-lg bg-gradient-to-l from-green-200 via-white to-white shadow">
              <div className="px-4 py-5 sm:p-6">
                <h1 className="flex flex-wrap items-center gap-2 text-4xl font-bold">
                  {device.name}{" "}
                  {isConnected ? (
                    <span className="rounded-full bg-green-600 px-2 py-1 text-xs font-normal uppercase tracking-wide text-white">
                      Online
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-600 px-2 py-1 text-xs font-normal uppercase tracking-wide text-white">
                      Offline
                    </span>
                  )}
                </h1>
                <span className="text- text-xs text-gray-500">
                  ID: {deviceId}
                </span>
              </div>
            </div>

            <div className="flex-1 flex-shrink-0 space-y-4">
              <div className="flex flex-col bg-white p-6 shadow">
                <h2 className="">{device.description}</h2>
                <p className="text mt-3 flex flex-wrap items-center text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657 13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                    />
                  </svg>
                  <span className="mx-1 font-semibold">Location:</span>
                  {device.location}
                </p>
                <p className="text mt-3 flex flex-wrap items-center text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"
                    />
                  </svg>
                  <span className="mx-1 font-semibold">Threshold:</span>
                  {device.threshold} ppm
                </p>
                <p className="text mt-3 flex flex-wrap items-center text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"
                    />
                  </svg>
                  <span className="mx-1 font-semibold">Created At:</span>
                  {new Date(device.created_at).toLocaleDateString()}
                </p>
                <div className="flex flex-col">
                  <div className="mt-4 flex flex-wrap gap-8"></div>
                </div>
              </div>
              <div className="flex flex-col bg-white p-6 shadow lg:flex-row lg:space-y-2 lg:space-x-4">
                <div className="flex flex-grow flex-col">
                  <h2 className="text-2xl font-semibold">Temperature</h2>
                  {data.length > 0 ? (
                    <Line
                      data={{
                        labels: data.map((d) =>
                          new Date(d.date).toLocaleString()
                        ),
                        datasets: [
                          {
                            borderColor: "#aaa",
                            data: data.map((d) => d.value),
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        elements: {
                          point: {
                            radius: 0,
                          },
                        },
                        plugins: {
                          decimation: {
                            enabled: true,
                            algorithm: "min-max",
                            samples: 5,
                          },
                          legend: {
                            display: false,
                          },
                          zoom: {
                            pan: {
                              enabled: true,
                              mode: "x",
                            },
                            zoom: {
                              wheel: {
                                enabled: true,
                              },
                              pinch: {
                                enabled: true,
                              },
                              mode: "x",
                            },
                          },
                          autocolors: false,
                          annotation: {
                            annotations: {
                              thresholdLine: {
                                type: "line",
                                yMin: device.threshold,
                                yMax: device.threshold,
                                borderColor: "rgb(244, 87, 121)",
                                borderWidth: 2,
                                borderDash: [4],
                                value: "hello",
                                label: {},
                              },
                            },
                          },
                        },
                      }}
                    />
                  ) : (
                    <p className="mt-1 text-gray-600">No temperature data</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col bg-white p-6 shadow lg:flex-row lg:space-y-2 lg:space-x-4">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-semibold">API Keys</h2>
                  <div className="mt-3 flex flex-col gap-2 bg-white sm:flex-row">
                    <button
                      className="h-8 rounded border border-transparent bg-indigo-600 px-2 py-1 text-sm text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={copyReadKey}
                    >
                      Copy Read Key
                    </button>
                    <button
                      className="h-8 rounded border border-transparent bg-indigo-600 px-2 py-1 text-sm text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={copyWriteKey}
                    >
                      Copy Write Key
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 shadow lg:flex-row lg:space-y-2 lg:space-x-4">
                <button
                  className="h-8 rounded border border-transparent bg-red-600 px-2 py-1 text-sm text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => setShowDeleteConfirmDialog(true)}
                >
                  Delete
                </button>
              </div>
            </div>
          </main>
        </div>
      </main>
    </div>
  );
};

export default DevicePage;
