import {io} from "socket.io-client";
import {IMessageSend, TypePushSocket} from "./IMessageSend";

// "undefined" means the URL will be computed from the `window.location` object
// const URL =
//   process.env.NODE_ENV === "production"
//     ? "http://localhost:3009"
//     : "http://localhost:3009";
const URL = process.env.REACT_APP_Socket_URL ?? "";
const userName = localStorage.getItem("userName")
    ? localStorage.getItem("userName")
    : undefined;
const EmpId = localStorage.getItem("empId")
    ? localStorage.getItem("empId")
    : undefined;
export const _socket = userName
    ? io(URL, {
        auth: {
            token: "123",
        },
        query: {
            userName: userName,
            EmpId: EmpId,
        },
        //  transports:["websocket"]
    })
    : undefined;

function SendMessageToTopic<T>(message: IMessageSend<T>): boolean {
    if (!userName) return false;
    if (!message.topic) {
        console.log("topic is null !");
        return false;
    }
    if (!message.type) message.type = TypePushSocket.NotSelf;
    _socket?.emit("send-to-topic", message);

    return true;
}

function SendMessageToUserName<T>(username: string, data: T): boolean {
    if (!userName) return false;
    if (!username) {
        console.log("username is null !");
        return false;
    }
    console.log("Push to username: " + username);
    _socket?.emit("sendToUserName", {
        userName: username,
        data: data,
    });
    return true;
}

function SendMessageToEmp<T>(emp: number, data: T): boolean {
    if (!userName) return false;
    if (!emp) {
        console.log("emp is null !");
        return false;
    }
    console.log("Push to emp: " + emp);
    _socket?.emit("sendToEmp", {
        empId: emp,
        data: data,
    });
    return true;
}

function JoinRoom(room: string) {
    if (!room) return false;
    console.log("join to room: " + room);
    _socket?.emit("join-room", {
        room: room,
    });
    return true;
}

function PushRoom<T>(room: string, evt: string, data: T) {
    if (!room || !evt) return false;
    console.log("PUSH to room: " + room);
    _socket?.emit("push-room", {
        room: room,
        evt: evt,
        data: data,
    });
    return true;
}

function On(topic: string, listener?: any) {
    console.log("listen to topic: " + topic);
    if (userName) _socket?.on(topic, listener);
}

function Emit(topic: string, listener?: any) {
    if (userName) _socket?.emit(topic, listener);
}

function OnSeft(listener?: any) {
    if (userName) {
        _socket?.on("listen" + userName, listener);
    }
}

function Off(topic: string, listener?: any) {
    if (userName) _socket?.off(topic, listener);
}

function Disconnect() {
    if (userName) {
        _socket?.disconnect();
        console.log("socket is disconnect!");
    }
}

function Connect() {
    if (userName) {
        _socket?.connect();
        console.log("socket is connect!");
    }
}

function Connected(): boolean {
    return _socket?.connected ?? false;
}

export const SocketExtension = {
    SendMessageToTopic,
    SendMessageToUserName,
    On,
    Off,
    OnSeft,
    Emit,
    Connect,
    Disconnect,
    Connected,
    SendMessageToEmp,
    JoinRoom,
    PushRoom,
};
