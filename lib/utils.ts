// Formatter for "Today" and "Yesterday" etc
const relative = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" });

// Formatter for weekdays, e.g. "Monday"
const short = new Intl.DateTimeFormat("en-GB", { weekday: "long" });

// Formatter for dates, e.g. "Mon, 31 May 2021"
const long = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

export const formatDate = (date: Date) => {
  const now = new Date().setHours(0, 0, 0, 0);
  const then = date.setHours(0, 0, 0, 0);
  const days = (then - now) / 86400000;
  if (days > -6) {
    if (days > -2) {
      return relative.format(days, "day");
    }
    return short.format(date);
  }
  return long.format(date);
};

export const getBlurImage = async (image: string) => {
  const placeholder = {
    base64:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/ALKlos3U3fz8/ODDrwA3PkIQHiUTIigAFBoA8enfgIB8o5+c2NTOk8wT4KC5u6gAAAAASUVORK5CYII=",
  };
  try {
    if (!image) {
      return placeholder;
    }
    const response = await fetch(`https://howtoshout.com/api/blur`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ src: image }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching blur image:", error);
    // throw error;
  }

  // const placeholder = {
  //   base64:
  //     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/ALKlos3U3fz8/ODDrwA3PkIQHiUTIigAFBoA8enfgIB8o5+c2NTOk8wT4KC5u6gAAAAASUVORK5CYII=",
  // };

  // return placeholder;
};
