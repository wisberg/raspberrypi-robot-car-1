Raspberry Pi Robot Car — Flask + PCA9685 + MJPG-Streamer

This project is a fully-functional web-controlled robot car built on a Raspberry Pi.
It uses:

Flask for the control webserver

PCA9685 for motor PWM and 3-axis camera servos

gpiozero for H-bridge direction pins

mjpg-streamer for live video feed at http://<pi>:8080/

Once running, you can drive the car and control the camera servos from any browser on the same network.

🔧 Hardware Used

Raspberry Pi (Zero 2 W, 3B+, 4B, 5 — all supported)

PCA9685 16-channel PWM driver

DC motors + motor driver with DIR control pins

Pan/Tilt camera mount with 3 servos

USB camera (/dev/video0)

Battery pack (PiSugar or similar)

📁 Project Structure
car_web/
├── server.py          # Flask web server + motor + servo control
├── templates/
│   └── index.html     # Control UI
├── static/            # JS/CSS for UI (if added)
└── requirements.txt   # Python dependencies

⚙️ Setup Instructions

Follow these steps exactly and you’ll have the car running in a few minutes.

1️⃣ Install system dependencies
sudo apt update
sudo apt install python3 python3-venv python3-pip git mjpg-streamer -y


If your system does not have mjpg-streamer in apt, build it manually (you did this already):

git clone https://github.com/jacksonliam/mjpg-streamer
cd mjpg-streamer/mjpg-streamer-experimental
make
sudo make install

2️⃣ Clone this repository
git clone https://github.com/wisberg/raspberrypi-robot-car-1.git
cd raspberrypi-robot-car-1

3️⃣ Create a Python virtual environment
python3 -m venv car-env
source car-env/bin/activate

4️⃣ Install Python dependencies
pip install -r requirements.txt


This installs:

Flask

adafruit-circuitpython-pca9685

adafruit-circuitpython-motor

gpiozero

other required libs

5️⃣ Enable I2C + Camera

Run:

sudo raspi-config


Enable:

Interface Options → I2C

Interface Options → Camera (if using Pi Camera)

Reboot if prompted

6️⃣ Wiring Summary
PCA9685 Channels:

channel 0 → Steering servo

channel 1 → Tilt servo

channel 2 → Pan servo

channel 4 → Left motor PWM

channel 5 → Right motor PWM

Direction Pins (RPi GPIO):

GPIO17 → Left motor direction

GPIO27 → Right motor direction

Your code automatically flips direction based on positive/negative motor values.

7️⃣ Start the robot car server

From inside the repo + activated venv:

python server.py


You’ll see Flask start at:

Running on http://0.0.0.0:5000


Video stream starts automatically on:

http://<your-pi-ip-address>:8080/


Control UI:

http://<your-pi-ip-address>:5000/

🎮 Controls

Your server.py maps browser commands to hardware:

Driving
Command	Action
forward	Both motors reverse (based on your wiring reversal)
back	Both motors forward
stop	Stop motors
Steering (Arrow keys)
Command	Action
steer_left	Decrease steering angle by 10°
steer_right	Increase steering angle by 10°
Camera (WASD + QE)
Command	Action
tilt_up	Tilt camera up
tilt_down	Tilt camera down
pan_left	Rotate camera left
pan_right	Rotate camera right

Angles are clamped to safe ranges to avoid servo over-travel.

🧪 Testing Without Motors

Before connecting motors, comment out:

drive(-speed, -speed)
drive(speed, speed)


Or temporarily set:

DRIVE_SPEED = 0

🚀 Run at Boot (Optional)

Create a systemd service:

sudo nano /etc/systemd/system/robotcar.service


Paste:

[Unit]
Description=Robot Car Flask Server
After=network.target

[Service]
ExecStart=/usr/bin/bash -c 'cd /home/pi/raspberrypi-robot-car-1 && source car-env/bin/activate && python server.py'
Restart=always
User=pi

[Install]
WantedBy=multi-user.target


Enable:

sudo systemctl enable robotcar.service
sudo systemctl start robotcar.service


Car now boots up ready to drive.

👍 Notes

Servos are initialized to center position (90°).

Pan servo starts at 90° — adjust for your mount.

PCA9685 max pulse is intentionally set wide for higher torque.

MJPG-Streamer path assumes you installed it in /home/<user>/mjpg-streamer/mjpg-streamer-experimental.

If your webcam is not /dev/video0, change the input line.

📜 License

MIT (or add your own).
