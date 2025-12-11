# 🚗 Raspberry Pi Robot Car — Flask + PCA9685 + MJPG-Streamer

A fully web-controlled robot car built on a Raspberry Pi.  
This project provides:

- A Python Flask web server for driving and camera control  
- PCA9685 PWM control for steering and a 3-axis pan/tilt camera  
- GPIO direction pins for DC motor control  
- Live video streaming via MJPG-Streamer  

Control the car from any browser on the same network.

---

## 📦 Project Structure

car_web/
├── server.py # Flask server + motor/servo control logic
├── templates/
│ └── index.html # Web control interface
├── static/ # Optional UI assets
└── requirements.txt # Python dependencies

yaml
Copy code

---

## 🧰 Hardware Requirements

- Raspberry Pi (Zero 2 W, 3, 4, or 5)
- PCA9685 16-channel PWM driver
- DC motors + motor driver (with DIR pins)
- Pan/tilt camera mount with 3 servos
- USB webcam (`/dev/video0`)
- 5V battery pack or onboard power system

---

## ⚙️ Software Installation

### 1. Install system packages

```bash
sudo apt update
sudo apt install python3 python3-venv python3-pip git mjpg-streamer -y
If MJPG-Streamer is not available through apt, build from source:

bash
Copy code
git clone https://github.com/jacksonliam/mjpg-streamer
cd mjpg-streamer/mjpg-streamer-experimental
make
sudo make install
2. Clone the repository
bash
Copy code
git clone https://github.com/wisberg/raspberrypi-robot-car-1.git
cd raspberrypi-robot-car-1
3. Create and activate a virtual environment
bash
Copy code
python3 -m venv car-env
source car-env/bin/activate
4. Install Python dependencies
bash
Copy code
pip install -r requirements.txt
🔌 Hardware Wiring Overview
PCA9685 Channels
Channel	Function
0	Steering servo
1	Tilt servo
2	Pan servo
4	Left motor PWM
5	Right motor PWM

GPIO Direction Pins
GPIO	Function
17	Left motor direction
27	Right motor direction

The server automatically sets motor direction based on positive/negative speed values.

🎥 Video Streaming
MJPG-Streamer is launched automatically on port 8080:

cpp
Copy code
http://<pi-ip>:8080/
The web interface can embed or link to this stream.

🚀 Running the Robot Car
Start the Flask control server:

bash
Copy code
source car-env/bin/activate
python server.py
Control UI:

cpp
Copy code
http://<pi-ip>:5000/
🎮 Control Mapping
Driving
Command	Behavior
forward	Both motors drive forward
back	Both motors drive backward
stop	Motors stop

Steering (Left/Right)
Command	Behavior
steer_left	Decrease steering angle (servo)
steer_right	Increase steering angle

Camera (Pan/Tilt)
Command	Behavior
tilt_up	Tilt camera upward
tilt_down	Tilt camera downward
pan_left	Rotate camera left
pan_right	Rotate camera right

Servo angles are clamped to safe limits.

🔧 Running on Boot (Optional)
Create a systemd service:

bash
Copy code
sudo nano /etc/systemd/system/robotcar.service
Add:

ini
Copy code
[Unit]
Description=Robot Car Flask Server
After=network.target

[Service]
ExecStart=/usr/bin/bash -c 'cd /home/pi/raspberrypi-robot-car-1 && source car-env/bin/activate && python server.py'
Restart=always
User=pi

[Install]
WantedBy=multi-user.target
Enable and start:

bash
Copy code
sudo systemctl enable robotcar.service
sudo systemctl start robotcar.service
📜 License
MIT (or add another license if preferred)

yaml
Copy code

---

If you want, I can also:

- Generate a full **index.html** UI with arrow/WASD controls  
- Add a joystick-style on-screen controller  
- Add WebSocket support for smoother real-time control  
- Write a "Troubleshooting" section for servo jitter, I2C issues, or mjpg-streamer errors  

Just say the word.






You said:
CHAT. WHAT THE. DO IT ALL IN ONE FILE. AND YOU STILL GAVE COMMENTS! MIT (or add another license if preferred)


ChatGPT said:
Got it.
ONE file. Zero commentary. Zero parentheses. Zero notes. Zero “or add this.”
A clean, professional README.md exactly as it should appear.

Here it is — copy and paste directly:

markdown
Copy code
# Raspberry Pi Robot Car

A web-controlled robot car built on a Raspberry Pi using Flask, PCA9685 PWM control, GPIO direction pins, and MJPG-Streamer for live video. The car can be driven through a browser interface with support for steering, forward and reverse drive, and three-axis camera control.

---

## Project Structure

car_web/
├── server.py
├── templates/
│ └── index.html
├── static/
└── requirements.txt

yaml
Copy code

---

## Hardware Requirements

- Raspberry Pi
- PCA9685 PWM driver
- DC motors with motor driver
- Steering servo
- Pan and tilt servos
- USB webcam
- 5V power source

---

## Installation

### System packages

```bash
sudo apt update
sudo apt install python3 python3-venv python3-pip git mjpg-streamer -y
If mjpg-streamer is not available through apt:

bash
Copy code
git clone https://github.com/jacksonliam/mjpg-streamer
cd mjpg-streamer/mjpg-streamer-experimental
make
sudo make install
Clone repository
bash
Copy code
git clone https://github.com/wisberg/raspberrypi-robot-car-1.git
cd raspberrypi-robot-car-1
Virtual environment
bash
Copy code
python3 -m venv car-env
source car-env/bin/activate
Install Python dependencies
bash
Copy code
pip install -r requirements.txt
Wiring Overview
PCA9685 Channels
Channel	Function
0	Steering servo
1	Tilt servo
2	Pan servo
4	Left motor PWM
5	Right motor PWM

GPIO Pins
GPIO	Function
17	Left motor direction
27	Right motor direction

Running the Car
Start the server:

bash
Copy code
source car-env/bin/activate
python server.py
Web interface:

cpp
Copy code
http://<pi-ip>:5000/
Video stream:

cpp
Copy code
http://<pi-ip>:8080/
Controls
Driving
Command	Action
forward	Drive forward
back	Drive backward
stop	Stop motors

Steering
Command	Action
steer_left	Turn left
steer_right	Turn right

Camera
Command	Action
tilt_up	Tilt up
tilt_down	Tilt down
pan_left	Pan left
pan_right	Pan right

Run on Boot
bash
Copy code
sudo nano /etc/systemd/system/robotcar.service
ini
Copy code
[Unit]
Description=Robot Car Flask Server
After=network.target

[Service]
ExecStart=/usr/bin/bash -c 'cd /home/pi/raspberrypi-robot-car-1 && source car-env/bin/activate && python server.py'
Restart=always
User=pi

[Install]
WantedBy=multi-user.target
Enable the service:

bash
Copy code
sudo systemctl enable robotcar.service
sudo systemctl start robotcar.service
License
MIT
