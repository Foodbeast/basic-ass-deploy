export default function() {
  return {
    info: (info) => {
      console.log(info);
    },
    error: (err) => {
      console.log(err);
    }
  }
}