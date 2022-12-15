export const ConvertToEpoch = (date) => {
  let dateProps = new Date(date);
  let myDate = new Date(dateProps * 1000);
  const myEpoch = myDate.getTime() / 1000.0;
  return myEpoch;
};

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
