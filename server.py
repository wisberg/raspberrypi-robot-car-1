from flask import Flask, render_template, request, jsonify
import subprocess
import board, busio, time
from adafruit_pca9685 import PCA9685
from adafruit_motor import servo
from gpiozero import LED  # For DIR pins

# ---------------------------------------------------
# START MJPG-STREAMER ON PORT 8080
# ---------------------------------------------------
def start_stream():
    subprocess.Popen([
        "mjpg_streamer",
        "-i", "input_uvc.so -d /dev/video0 -r 640x480 -f 20",
        "-o", "output_http.so -w /home/duffisberg/mjpg-streamer/mjpg-streamer-experimental/www -p 8080"
    ])

# ---------------------------------------------------
# PCA9685 SETUP
# ---------------------------------------------------
i2c = busio.I2C(board.SCL, board.SDA)
pca = PCA9685(i2c, address=0x40)
pca.frequency = 50  # servo frequency

# Servos -- max_pulse set high for max torque (test carefully)
steer = servo.Servo(pca.channels[0], min_pulse=500, max_pulse=3000)
tilt  = servo.Servo(pca.channels[1], min_pulse=500, max_pulse=3000)
pan   = servo.Servo(pca.channels[2], min_pulse=500, max_pulse=3000)

# Initial angles
steer_angle = 90
tilt_angle  = 90
pan_angle   = 90  # Center for your hardware
steer.angle = steer_angle
tilt.angle  = tilt_angle
pan.angle   = pan_angle

# Motors on PCA9685 channels
LEFT  = 4
RIGHT = 5
# DIR pins (using RPi GPIO17 for left, GPIO27 for right)
LEFT_DIR  = LED(17)
RIGHT_DIR = LED(27)

DRIVE_SPEED = 80  # Default speed - can be set from UI

def motor(channel, percent):
    percent = max(0, min(100, abs(percent)))
    duty = int((percent / 100) * 0xFFFF)
    pca.channels[channel].duty_cycle = duty

def drive(left_speed, right_speed):
    # Set direction with DIR pins
    if left_speed >= 0:
        LEFT_DIR.on()
    else:
        LEFT_DIR.off()
    if right_speed >= 0:
        RIGHT_DIR.on()
    else:
        RIGHT_DIR.off()
    # Set PWM absolute value for speed
    motor(LEFT, left_speed)
    motor(RIGHT, right_speed)

def stop_motors():
    drive(0, 0)

# ---------------------------------------------------
# FLASK APP
# ---------------------------------------------------
app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/cmd", methods=["POST"])
def cmd():
    global steer_angle, tilt_angle, pan_angle, DRIVE_SPEED
    c = request.form["cmd"]
    speed = int(request.form.get("speed", DRIVE_SPEED))
    # ---------------------
    # DRIVING (reversed mapping for your wiring)
    # ---------------------
    if c == "forward":
        drive(-speed, -speed)
    elif c == "back":
        drive(speed, speed)
    elif c == "stop":
        stop_motors()
    # ---------------------
    # STEERING (Arrow Left/Right, reversed)
    elif c == "steer_left":
        steer_angle = max(10, steer_angle - 10)
        steer.angle = steer_angle
    elif c == "steer_right":
        steer_angle = min(170, steer_angle + 10)
        steer.angle = steer_angle
    # ---------------------
    # CAMERA SERVOS (WASD): Full pan range (0 to 170)
    elif c == "tilt_up":
        tilt_angle = min(170, tilt_angle + 3)
        tilt.angle = tilt_angle
    elif c == "tilt_down":
        tilt_angle = max(10, tilt_angle - 3)
        tilt.angle = tilt_angle
    elif c == "pan_right":
        pan_angle = min(170, pan_angle + 3)
        pan.angle = pan_angle
    elif c == "pan_left":
        pan_angle = max(0, pan_angle - 3)
        pan.angle = pan_angle
    return "ok"

@app.route("/status")
def status():
    return jsonify({
        "steer": steer_angle,
        "tilt": tilt_angle,
        "pan": pan_angle
    })

# ---------------------------------------------------
# ENTRY POINT
# ---------------------------------------------------
if __name__ == "__main__":
    start_stream()
    app.run(host="0.0.0.0", port=5000)
