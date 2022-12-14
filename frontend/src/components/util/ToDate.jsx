export default function ToDate(date, type) {
  const convertDate = (dateProps, aksi) => {
    let date = new Date(dateProps);

    return aksi == "full"
      ? date
          .toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          })
          .toString()
      : date
          .toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
          .toString();
  };

  return convertDate(date, type);
}
