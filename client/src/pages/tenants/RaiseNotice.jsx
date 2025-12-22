import BackButton from "../../components/BackButton";

const RaiseNotice = () => {
  return (
    <div>
      <BackButton />
      <h1>Raise Notice</h1>

      <textarea placeholder="Reason for leaving" rows="4" />
      <br /><br />
      <button>Submit Notice</button>
    </div>
  );
};

export default RaiseNotice;
