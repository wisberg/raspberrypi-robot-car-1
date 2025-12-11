# Raspberry Pi Robot Car

A web-controlled robot car built on a Raspberry Pi using Flask, PCA9685 PWM control, GPIO direction pins, and MJPG-Streamer for live video. The car can be driven through a browser interface with steering, drive control, and three-axis camera movement.

## Hardware Requirements
- Raspberry Pi
- PCA9685 PWM driver
- DC motors with driver
- Steering servo
- Pan and tilt servos
- USB webcam
- 5V power source

## Installation

### Install system packages
sudo apt update
sudo apt install python3 python3-venv python3-pip git mjpg-streamer -y

If mjpg-streamer is not available:
git clone https://github.com/jacksonliam/mjpg-streamer
cd mjpg-streamer/mjpg-streamer-experimental
make
sudo make install

### Clone the repository
git clone https://github.com/wisberg/raspberrypi-robot-car-1.git
cd raspberrypi-robot-car-1

### Create a virtual environment
python3 -m venv car-env
source car-env/bin/activate

### Install Python dependencies
pip install -r requirements.txt

## Wiring Overview

### PCA9685 Channels
Channel 0  Steering servo  
Channel 1  Tilt servo  
Channel 2  Pan servo  
Channel 4  Left motor PWM  
Channel 5  Right motor PWM  

### GPIO Pins
GPIO17  Left motor direction  
GPIO27  Right motor direction  

## Running the Car

### Start the server
source car-env/bin/activate  
python server.py  

### Web interface
http://<pi-ip>:5000/

### Video stream
http://<pi-ip>:8080/

## Controls

### Driving
forward  
back  
stop  

### Steering
steer_left  
steer_right  

### Camera
tilt_up  
tilt_down  
pan_left  
pan_right  

## Run on Boot

Create a service file:
sudo nano /etc/systemd/system/robotcar.service

Add:
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

## License
MIT

