const Controls = ({jump, startSliding, stopSliding}) => {
	return (
		<div className="controls">
			<button onClick={jump} className="controls__button">Jump</button>
			<button onPointerDown={startSliding} onPointerUp={stopSliding} className="controls__button" >Slide</button>
		</div>
	)
}

export default Controls
