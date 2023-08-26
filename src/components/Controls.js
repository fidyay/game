const Controls = ({ jump, startSliding, stopSliding }) => {
  return (
    <div className="controls">
      <button onClick={jump} className="controls__button">
        ↑
      </button>
      <button
        onPointerDown={startSliding}
        onPointerUp={stopSliding}
        className="controls__button"
      >
        ↓
      </button>
    </div>
  );
};

export default Controls;
