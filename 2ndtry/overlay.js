class PIDController {
    constructor(kp, ki, kd, maxIntegral = 100, deadband = 1) {
      this.kp = kp;
      this.ki = ki;
      this.kd = kd;
      this.maxIntegral = maxIntegral;
      this.deadband = deadband;
      this.prevError = 0;
      this.integral = 0;
    }
  
    update(setpoint, measured) {
      let error = setpoint - measured;
  
      // Apply deadband
      if (Math.abs(error) < this.deadband) {
        error = 0;
      }
  
      this.integral += error;
  
      // Clamp the integral term to prevent integral windup
      if (this.integral > this.maxIntegral) {
        this.integral = this.maxIntegral;
      } else if (this.integral < -this.maxIntegral) {
        this.integral = -this.maxIntegral;
      }
  
      const derivative = error - this.prevError;
      this.prevError = error;
      return this.kp * error + this.ki * this.integral + this.kd * derivative;
    }
  }
  
  const pid = new PIDController(0.9, 0, 0); // Adjusted PID constants
  let targetY = window.innerHeight / 2;
  
  const overlay = document.createElement('div');
  overlay.id = 'overlay';
  
  const visibleArea = document.createElement('div');
  visibleArea.id = 'visibleArea';
  
  overlay.appendChild(visibleArea);
  document.body.appendChild(overlay);
  
  function updatePosition() {
    const currentY = parseFloat(visibleArea.style.top || '0');
    const offsetY = pid.update(targetY, currentY);
    let newTop = currentY + offsetY;
  
    // Ensure the visible area doesn't go out of bounds
    newTop = Math.max(0, Math.min(newTop, window.innerHeight - visibleArea.offsetHeight));
  
    visibleArea.style.top = newTop + 'px';
    requestAnimationFrame(updatePosition);
  }
  
  document.addEventListener('mousemove', function(event) {
    const newTargetY = event.clientY - 150; // 150px above the mouse
  
    // Check if the new target is within 77 pixels above or below the current position
    if (Math.abs(newTargetY - targetY) > 77) {
      targetY = newTargetY;
    }
  });
  
  updatePosition(); // Start the position update loop
  