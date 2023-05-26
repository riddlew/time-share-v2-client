import { useState, useEffect } from "react";
import socket from "./socket";
import ConnectionState from "./ConnectionState";
import Timestamp from "./Timestamp";
import TimerForm from "./TimerForm";
import formatTimestamp from "../helpers/formatTimestamp";

const Room = (): JSX.Element => {
	const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
	const [timestamp, setTimestamp] = useState<number>(0);
	const [usersInRoom, setUsersInRoom] = useState<number>(0);

	useEffect(() => {
		const roomName = window.location.href.split("/")[3];

		const onConnect = (): void => {
			socket.emit("join", roomName);
			setIsConnected(true);
		};

		const onDisconnect = (): void => {
			setIsConnected(false);
		};

		const onTimerUpdate = (value: string): void => {
			console.log("timer", value);
			setTimestamp(parseInt(value));
		};

		const onUsersInRoom = (value: string): void => {
			console.log("usersInRoom", value);
			setUsersInRoom(parseInt(value));
		};

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("timerUpdated", onTimerUpdate);
		socket.on("usersInRoom", onUsersInRoom);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("timerUpdated", onTimerUpdate);
			socket.off("usersInRoom", onUsersInRoom);
		};
	}, []);

	useEffect(() => {
		console.log({ timestamp });
		// update the document title, with roomName and timestamp
		document.title = `${formatTimestamp(timestamp)}-${
			window.location.href.split("/")[3]
		}`;
	}, [timestamp]);

	useEffect(() => {
		console.log("URL", window.location.href);
		console.log("roomId:", window.location.href.split("/")[3]);
	}, [isConnected]);

	return (
		<>
			<ConnectionState isConnected={isConnected} />
			<Timestamp timestamp={timestamp} />
			<TimerForm />
			<p>Users in room: {usersInRoom}</p>
		</>
	);
};

export default Room;
