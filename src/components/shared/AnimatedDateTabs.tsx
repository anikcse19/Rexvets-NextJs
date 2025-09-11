"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CalendarDays,
  CalendarRange,
  Clock,
  RotateCcw,
} from "lucide-react";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDashboardContext } from "@/hooks/DashboardContext";
import { cn } from "@/lib/utils";

export interface DateRange {
  start: Date;
  end: Date;
}

type TabType = "today" | "week" | "month" | "custom" | "range";

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

interface DateInfo {
  startDate: Date;
  endDate: Date;
  displayText: string;
  duration: number;
  dateRange: DateRange;
}

interface AnimatedDateTabsProps {
  onDateChange?: (dateInfo: DateInfo) => void;
  initialTab?: TabType;
  className?: string;
}

const tabs: Tab[] = [
  { id: "today", label: "Today", icon: <Clock className="w-4 h-4" /> },
  {
    id: "week",
    label: "This Week",
    icon: <CalendarDays className="w-4 h-4" />,
  },
  { id: "month", label: "This Month", icon: <Calendar className="w-4 h-4" /> },
  {
    id: "custom",
    label: "Custom Date",
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    id: "range",
    label: "Date Range",
    icon: <CalendarRange className="w-4 h-4" />,
  },
];

const AnimatedDateTabs: React.FC<AnimatedDateTabsProps> = ({
  onDateChange,
  initialTab = "week",
  className,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [customDate, setCustomDate] = useState<Date | undefined>(undefined);
  const [dateRange, setDateRange] = useState<
    { from?: Date; to?: Date } | undefined
  >(undefined);
  const { selectedRange, setSelectedRange } = useDashboardContext();

  // Initialize dateRange based on the initial tab
  useEffect(() => {
    const now = moment();
    let initialRange: { from?: Date; to?: Date } | undefined;

    switch (initialTab) {
      case "today":
        initialRange = {
          from: now.clone().startOf("day").toDate(),
          to: now.clone().endOf("day").toDate(),
        };
        break;
      case "week":
        initialRange = {
          from: now.clone().startOf("day").toDate(),
          to: now.clone().add(6, "days").endOf("day").toDate(),
        };
        break;
      case "month":
        initialRange = {
          from: now.clone().startOf("month").toDate(),
          to: now.clone().endOf("month").toDate(),
        };
        break;
      case "custom":
        // Will be set when custom date is selected
        break;
      case "range":
        // Will be set when range is selected
        break;
    }

    if (initialRange) {
      setDateRange(initialRange);
      // Also update the dashboard context
      setSelectedRange({
        start: moment(initialRange.from!).format("YYYY-MM-DD"),
        end: moment(initialRange.to!).format("YYYY-MM-DD"),
      });
    }
  }, [initialTab, setSelectedRange]);

  // Memoized date calculations using moment.js
  const dateInfo = useMemo((): Record<TabType, DateInfo> => {
    const now = moment();

    // Helper function to safely format dates
    const safeFormat = (
      date: Date | undefined,
      format: string,
      fallback: string
    ) => {
      if (!date || !moment(date).isValid()) return fallback;
      return moment(date).format(format);
    };

    return {
      today: {
        startDate: now.clone().startOf("day").toDate(),
        endDate: now.clone().endOf("day").toDate(),
        displayText: now.format("dddd, MMMM Do, YYYY"),
        duration: 1,
        dateRange: {
          start: now.clone().startOf("day").toDate(),
          end: now.clone().endOf("day").toDate(),
        },
      },
      week: {
        startDate: now.clone().startOf("day").toDate(),
        endDate: now.clone().add(6, "days").endOf("day").toDate(),
        displayText: `${now.format("MMM Do")} - ${now
          .clone()
          .add(6, "days")
          .format("MMM Do, YYYY")}`,
        duration: 7,
        dateRange: {
          start: now.clone().startOf("day").toDate(),
          end: now.clone().add(6, "days").endOf("day").toDate(),
        },
      },
      month: {
        startDate: now.clone().startOf("month").toDate(),
        endDate: now.clone().endOf("month").toDate(),
        displayText: `${now.format("MMMM")} ${now.format("YYYY")}`,
        duration: now.daysInMonth(),
        dateRange: {
          start: now.clone().startOf("month").toDate(),
          end: now.clone().endOf("month").toDate(),
        },
      },
      custom: {
        startDate: customDate || now.toDate(),
        endDate: customDate || now.toDate(),
        displayText: safeFormat(
          customDate,
          "dddd, MMMM Do, YYYY",
          "No date selected"
        ),
        duration: 1,
        dateRange: {
          start: customDate || now.toDate(),
          end: customDate || now.toDate(),
        },
      },
      range: {
        startDate: dateRange?.from || now.toDate(),
        endDate: dateRange?.to || now.toDate(),
        displayText:
          dateRange?.from && dateRange?.to
            ? `${moment(dateRange.from).format("MMM Do")} - ${moment(
                dateRange.to
              ).format("MMM Do, YYYY")}`
            : "No range selected",
        duration:
          dateRange?.from && dateRange?.to
            ? Math.max(
                1,
                moment(dateRange.to).diff(moment(dateRange.from), "days") + 1
              )
            : 1,
        dateRange: {
          start: dateRange?.from || now.toDate(),
          end: dateRange?.to || now.toDate(),
        },
      },
    };
  }, [customDate, dateRange]);

  // Call onDateChange when dateInfo changes (after initialization)
  useEffect(() => {
    if (onDateChange) {
      onDateChange(dateInfo[activeTab]);
    }
  }, [onDateChange, dateInfo, activeTab]);

  const handleTabClick = useCallback(
    (tabId: TabType) => {
      setActiveTab(tabId);

      // Update dateRange state based on the selected tab
      const now = moment();
      let newRange: { from?: Date; to?: Date } | undefined;

      switch (tabId) {
        case "today":
          newRange = {
            from: now.clone().startOf("day").toDate(),
            to: now.clone().endOf("day").toDate(),
          };
          break;
        case "week":
          newRange = {
            from: now.clone().startOf("day").toDate(),
            to: now.clone().add(6, "days").endOf("day").toDate(),
          };
          break;
        case "month":
          newRange = {
            from: now.clone().startOf("month").toDate(),
            to: now.clone().endOf("month").toDate(),
          };
          break;
        case "custom":
          // Keep existing custom date range if available
          if (customDate) {
            newRange = {
              from: customDate,
              to: customDate,
            };
          }
          break;
        case "range":
          // Keep existing range if available
          break;
      }

      if (newRange) {
        setDateRange(newRange);
        // Also update the dashboard context
        setSelectedRange({
          start: moment(newRange.from!).format("YYYY-MM-DD"),
          end: moment(newRange.to!).format("YYYY-MM-DD"),
        });
      }

      if (onDateChange) {
        onDateChange(dateInfo[tabId]);
      }
    },
    [onDateChange, dateInfo, customDate, setSelectedRange]
  );

  const handleCustomDateSelect = useCallback(
    (date: Date | undefined) => {
      if (date && moment(date).isValid()) {
        setCustomDate(date);
        setActiveTab("custom");
        // Update dashboard context
        setSelectedRange({
          start: moment(date).format("YYYY-MM-DD"),
          end: moment(date).format("YYYY-MM-DD"),
        });

        if (onDateChange) {
          const customInfo = {
            startDate: date,
            endDate: date,
            displayText: moment(date).format("dddd, MMMM Do, YYYY"),
            duration: 1,
            dateRange: {
              start: date,
              end: date,
            },
          };
          onDateChange(customInfo);
        }
      }
    },
    [onDateChange, setSelectedRange]
  );

  const handleRangeSelect = useCallback(
    (range: { from?: Date; to?: Date } | undefined) => {
      if (
        range?.from &&
        range?.to &&
        moment(range.from).isValid() &&
        moment(range.to).isValid()
      ) {
        // Ensure end date is not before start date
        if (
          moment(range.to).isAfter(range.from) ||
          moment(range.to).isSame(range.from, "day")
        ) {
          setDateRange(range);
          setActiveTab("range");
          // Update dashboard context
          setSelectedRange({
            start: moment(range.from).format("YYYY-MM-DD"),
            end: moment(range.to).format("YYYY-MM-DD"),
          });

          if (onDateChange) {
            const rangeInfo = {
              startDate: range.from,
              endDate: range.to,
              displayText: `${moment(range.from).format("MMM Do")} - ${moment(
                range.to
              ).format("MMM Do, YYYY")}`,
              duration: Math.max(
                1,
                moment(range.to).diff(moment(range.from), "days") + 1
              ),
              dateRange: {
                start: range.from,
                end: range.to,
              },
            };
            onDateChange(rangeInfo);
          }
        }
      }
    },
    [onDateChange, setSelectedRange]
  );

  const handleClear = useCallback(() => {
    // Reset to initial tab
    setActiveTab(initialTab);
    setCustomDate(undefined);
    setDateRange(undefined);

    // Reset to initial tab's date range
    const now = moment();
    let initialRange: { from?: Date; to?: Date } | undefined;

    switch (initialTab) {
      case "today":
        initialRange = {
          from: now.clone().startOf("day").toDate(),
          to: now.clone().endOf("day").toDate(),
        };
        break;
      case "week":
        initialRange = {
          from: now.clone().startOf("day").toDate(),
          to: now.clone().add(6, "days").endOf("day").toDate(),
        };
        break;
      case "month":
        initialRange = {
          from: now.clone().startOf("month").toDate(),
          to: now.clone().endOf("month").toDate(),
        };
        break;
      case "custom":
        // Keep undefined for custom
        break;
      case "range":
        // Keep undefined for range
        break;
    }

    if (initialRange) {
      setDateRange(initialRange);
      setSelectedRange({
        start: moment(initialRange.from!).format("YYYY-MM-DD"),
        end: moment(initialRange.to!).format("YYYY-MM-DD"),
      });
    } else {
      setSelectedRange(null);
    }

    // Call onDateChange with the reset date info
    if (onDateChange) {
      onDateChange(dateInfo[initialTab]);
    }
  }, [initialTab, onDateChange, dateInfo, setSelectedRange]);

  return (
    <div
      className={cn("w-full max-w-4xl mx-auto p-3 sm:p-6 bg-white", className)}
    >
      <div className="mb-4 sm:mb-8 text-center">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Date Selection
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Choose your preferred date option
        </p>
      </div>

      {/* Animated Tabs */}
      <div className="relative mb-4 sm:mb-8">
        <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 bg-gray-100 rounded-lg sm:rounded-xl p-1 sm:p-2 shadow-inner">
          {tabs.map((tab) => {
            if (tab.id === "custom") {
              return (
                <Popover key={tab.id}>
                  <PopoverTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={activeTab === tab.id ? "default" : "ghost"}
                        className="relative flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 m-0.5 sm:m-1 rounded-md sm:rounded-lg font-medium transition-colors duration-200 text-xs sm:text-sm"
                        aria-label={`Select ${tab.label.toLowerCase()}`}
                      >
                        {tab.icon}
                        <span className="whitespace-nowrap hidden sm:inline">
                          {tab.label}
                        </span>
                        <span className="whitespace-nowrap sm:hidden">
                          {tab.label.split(" ")[0]}
                        </span>
                      </Button>
                    </motion.div>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 mx-2 sm:mx-0"
                    align="center"
                  >
                    <CalendarComponent
                      mode="single"
                      selected={customDate}
                      onSelect={handleCustomDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              );
            }

            if (tab.id === "range") {
              return (
                <Popover key={tab.id}>
                  <PopoverTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={activeTab === tab.id ? "default" : "ghost"}
                        className="relative flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 m-0.5 sm:m-1 rounded-md sm:rounded-lg font-medium transition-colors duration-200 text-xs sm:text-sm"
                        aria-label={`Select ${tab.label.toLowerCase()}`}
                      >
                        {tab.icon}
                        <span className="whitespace-nowrap hidden sm:inline">
                          {tab.label}
                        </span>
                        <span className="whitespace-nowrap sm:hidden">
                          {tab.label.split(" ")[0]}
                        </span>
                      </Button>
                    </motion.div>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 mx-2 sm:mx-0"
                    align="center"
                  >
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={
                        dateRange?.from && dateRange?.to
                          ? (dateRange as { from: Date; to: Date })
                          : undefined
                      }
                      onSelect={handleRangeSelect}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              );
            }

            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`relative flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 m-0.5 sm:m-1 rounded-md sm:rounded-lg font-medium transition-colors duration-200 text-xs sm:text-sm ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                aria-label={`Select ${tab.label.toLowerCase()}`}
                aria-pressed={activeTab === tab.id}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {tab.icon}
                  <span className="whitespace-nowrap">{tab.label}</span>
                </span>
              </motion.button>
            );
          })}

          {/* Clear Button */}
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className=" cursor-pointer  absolute right-[200px] top-[94px] md:top-[65px]  flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 m-0.5 sm:m-1 rounded-md sm:rounded-lg font-medium transition-colors duration-200 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-xs sm:text-sm"
              aria-label="Clear and reset to initial date"
            >
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="whitespace-nowrap">Clear</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {/* <div className="min-h-[300px]">
        <AnimatePresence mode="wait">{renderTabContent()}</AnimatePresence>
      </div> */}
    </div>
  );
};

export default React.memo(AnimatedDateTabs);
//
