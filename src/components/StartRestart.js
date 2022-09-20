export default function StartRestart({ gameLost, setGameStarted }) {
  return (
    <svg
      className="start"
      onClick={() => setGameStarted(true)}
      xmlns="http://www.w3.org/2000/svg"
      height="120px"
      viewBox="0 0 24 24"
      width="120px"
      fill="#e5da1f"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d={`${
          gameLost
            ? "M12,5V1L7,6l5,5V7c3.31,0,6,2.69,6,6s-2.69,6-6,6s-6-2.69-6-6H4c0,4.42,3.58,8,8,8s8-3.58,8-8S16.42,5,12,5z"
            : "M8 5v14l11-7z"
        }`}
      />
    </svg>
  );
}
