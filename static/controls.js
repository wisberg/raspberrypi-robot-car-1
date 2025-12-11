let keyIntervals = {};

// Throttle slider UI
window.addEventListener('DOMContentLoaded', function() {
    const wrap = document.createElement('div');
    wrap.style = 'position:fixed;left:30px;top:32px;z-index:999;background:rgba(0,0,0,0.9);border:2px solid #00ff00;padding:16px 15px 12px 20px;box-shadow:0 0 20px rgba(0,255,0,0.5);width:220px;color:#00ff00;font-size:15px;text-shadow:0 0 5px #00ff00;';
    wrap.innerHTML = '<b>THROTTLE</b> <span id="throttle-val">80</span>%<br><input id="throttle" type="range" min="30" max="100" step="1" value="80" style="width:140px;accent-color:#00ff00;">';
    document.body.appendChild(wrap);
    document.getElementById('throttle').addEventListener('input', function(e){
        document.getElementById('throttle-val').textContent = this.value;
    });
});

function getThrottle() {
    let t = document.getElementById('throttle');
    if(!t) return 80;
    return parseInt(t.value);
}

// Updated version to send speed param
function sendCmd(cmd, opts={}) {
    let body = "cmd=" + cmd;
    if (opts.speed) {
        body += "&speed=" + opts.speed;
    }
    fetch("/cmd", {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body
    });
}

const tiltKeys = {"w": "tilt_up", "s": "tilt_down"};
const panKeys = {"a": "pan_right", "d": "pan_left"};
const steerKeys = {"ArrowLeft":"steer_left", "ArrowRight":"steer_right"};
const driveKeys = {"ArrowUp": "forward", "ArrowDown": "back"};

// Debounce tracker for keys
const debounce = {};
function safeInterval(key, fn, ms) {
    if (!keyIntervals[key]) {
        fn();
        debounce[key] = true;
        keyIntervals[key]=setInterval(fn, ms);
    }
}
function clearKey(key) {
    if(keyIntervals[key]){
        clearInterval(keyIntervals[key]);
        delete keyIntervals[key];
        debounce[key]=false;
    }
}

// Servo angle display UI
window.addEventListener('DOMContentLoaded', function() {
    // Add servo angle status display
    const stat = document.createElement('div');
    stat.id = 'servo-angle-status';
    stat.style = 'position:fixed;left:30px;top:95px;z-index:998;background:rgba(0,0,0,0.9);border:2px solid #00ff00;padding:12px 20px;box-shadow:0 0 20px rgba(0,255,0,0.5);font-size:15px;min-width:170px;color:#00ff00;text-shadow:0 0 5px #00ff00;';
    stat.innerHTML = '<b>SERVO ANGLES</b><br>Steering: <span id="sa-steer">?</span>°<br>Tilt: <span id="sa-tilt">?</span>°<br>Pan: <span id="sa-pan">?</span>°';
    document.body.appendChild(stat);

    // Poll /status endpoint every 0.5s
    setInterval(()=>{
        fetch('/status').then(r=>r.json()).then(s=>{
            document.getElementById('sa-steer').textContent = s.steer;
            document.getElementById('sa-tilt').textContent = s.tilt;
            document.getElementById('sa-pan').textContent = s.pan;
        }).catch(()=>{});
    }, 500);
});

// Keydown handler
addEventListener("keydown", e => {
    // Visual feedback
    document.body.classList.add('down-'+e.key);
    // Driving: only activate on fresh press, repeat while held
    if ((e.key === "ArrowUp" || e.key === "ArrowDown")) {
        safeInterval(e.key,()=>sendCmd(driveKeys[e.key], {speed:getThrottle()}),80);
    }
    // Steering
    if (e.key in steerKeys) safeInterval(e.key,()=>sendCmd(steerKeys[e.key]),80);
    // Pan/Tilt
    if (e.key in tiltKeys) safeInterval(e.key,()=>sendCmd(tiltKeys[e.key]),80);
    if (e.key in panKeys) safeInterval(e.key,()=>sendCmd(panKeys[e.key]),80);
});

// Keyup handler: clear interval for pan/tilt/steer
addEventListener("keyup", e => {
    clearKey(e.key);
    document.body.classList.remove('down-'+e.key);
    // Stop the car as soon as forward or back key is released
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        sendCmd("stop");
    }
});
