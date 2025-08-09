class HotPotatoGame {
  constructor(canvasId, gameState, updateScore, hotPotatoes, teamStats, currentUser, onTaskClick, onTaskComplete) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error('Canvas element not found');
      return;
    }
    
    this.ctx = this.canvas.getContext('2d');
    this.gameState = gameState;
    this.updateScore = updateScore;
    this.hotPotatoes = hotPotatoes;
    this.teamStats = teamStats;
    this.currentUser = currentUser;
    this.onTaskClick = onTaskClick;
    this.onTaskComplete = onTaskComplete;
    
    this.isRunning = false;
    this.animationId = null;
    this.spirits = [];
    this.particles = [];
    this.locations = [];
    this.selectedTask = null;
    this.showTaskModal = false;
    
    this.initializeLocations();
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.gameLoop = this.gameLoop.bind(this);
    this.resizeCanvas();
  }
  
  initializeLocations() {
    this.locations = [
      { name: "Sales Office", x: 100, y: 100, radius: 60, color: "#FFCC00", tasks: [] },
      { name: "Customer Service", x: 300, y: 150, radius: 60, color: "#66B2FF", tasks: [] },
      { name: "Construction Hub", x: 500, y: 100, radius: 60, color: "#9B59B6", tasks: [] },
      { name: "Quality Control", x: 700, y: 150, radius: 60, color: "#2ECC71", tasks: [] },
      { name: "Pre-Construction", x: 200, y: 300, radius: 60, color: "#FF6B6B", tasks: [] },
      { name: "Admin Center", x: 600, y: 300, radius: 60, color: "#4A90E2", tasks: [] }
    ];
  }
  
  resizeCanvas() {
    const container = this.canvas.parentElement;
    const rect = container.getBoundingClientRect();
    this.canvas.width = Math.min(800, rect.width - 20);
    this.canvas.height = 400;
  }
  
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.canvas.addEventListener('click', this.handleClick);
    document.addEventListener('keydown', this.handleKeyPress);
    this.generateSpirits();
    this.updateTaskLocations();
    this.gameLoop();
  }
  
  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.canvas.removeEventListener('click', this.handleClick);
    document.removeEventListener('keydown', this.handleKeyPress);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  generateSpirits() {
    this.spirits = [];
    const totalTasks = this.hotPotatoes.length;
    const spiritCount = Math.min(8, Math.max(3, Math.floor(totalTasks / 2)));
    
    for (let i = 0; i < spiritCount; i++) {
      this.spirits.push({
        x: Math.random() * (this.canvas.width - 60) + 30,
        y: Math.random() * (this.canvas.height - 60) + 30,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: 15 + Math.random() * 10,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        glow: Math.random() * 15 + 10,
        pulsePhase: Math.random() * Math.PI * 2,
        id: i,
        energy: Math.random() * 100 + 50
      });
    }
  }
  
  updateTaskLocations() {
    // Clear existing task assignments
    this.locations.forEach(loc => loc.tasks = []);
    
    // Distribute tasks to locations based on category
    this.hotPotatoes.forEach(task => {
      let targetLocation;
      
      switch(task.category) {
        case 'Sales':
          targetLocation = this.locations.find(l => l.name === "Sales Office");
          break;
        case 'New Lead':
        case 'New Customer':
          targetLocation = this.locations.find(l => l.name === "Customer Service");
          break;
        case 'Construction':
          targetLocation = this.locations.find(l => l.name === "Construction Hub");
          break;
        case 'Post Construction':
          targetLocation = this.locations.find(l => l.name === "Quality Control");
          break;
        case 'Pre-Construction':
          targetLocation = this.locations.find(l => l.name === "Pre-Construction");
          break;
        default:
          targetLocation = this.locations.find(l => l.name === "Admin Center");
      }
      
      if (targetLocation) {
        targetLocation.tasks.push(task);
      }
    });
  }
  
  handleClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    for (let spirit of this.spirits) {
      const distance = Math.sqrt((x - spirit.x) ** 2 + (y - spirit.y) ** 2);
      if (distance < spirit.size) {
        this.handleSpiritClick(spirit);
        return;
      }
    }
    
    for (let location of this.locations) {
      const distance = Math.sqrt((x - location.x) ** 2 + (y - location.y) ** 2);
      if (distance < location.radius && location.tasks.length > 0) {
        this.handleLocationClick(location);
        return;
      }
    }
  }
  
  handleSpiritClick(spirit) {
    let nearestLocation = null;
    let minDistance = Infinity;
    
    for (let location of this.locations) {
      if (location.tasks.length > 0) {
        const distance = Math.sqrt((spirit.x - location.x) ** 2 + (spirit.y - location.y) ** 2);
        if (distance < minDistance) {
          minDistance = distance;
          nearestLocation = location;
        }
      }
    }
    
    if (nearestLocation) {
      this.handleLocationClick(nearestLocation);
    }
    
    this.updateScore(10);
    this.createParticles(spirit.x, spirit.y, "+10", "#FFCC00");
  }
  
  handleLocationClick(location) {
    if (location.tasks.length === 0) return;
    
    const task = location.tasks[0];
    this.selectedTask = task;
    this.showTaskModal = true;
    
    this.updateScore(25);
    this.createParticles(location.x, location.y, "+25", "#66B2FF");
  }
  
  handleKeyPress(event) {
    if (event.key === 'Escape') {
      this.showTaskModal = false;
      this.selectedTask = null;
    }
  }
  
  createParticles(x, y, text, color) {
    for (let i = 0; i < 5; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 3 - 1,
        life: 60,
        maxLife: 60,
        color: color,
        text: i === 0 ? text : null,
        size: 4 + Math.random() * 4
      });
    }
  }
  
  updateSpirits() {
    this.spirits.forEach(spirit => {
      spirit.x += spirit.vx;
      spirit.y += spirit.vy;
      
      if (spirit.x <= spirit.size || spirit.x >= this.canvas.width - spirit.size) {
        spirit.vx *= -0.8;
        spirit.x = Math.max(spirit.size, Math.min(this.canvas.width - spirit.size, spirit.x));
      }
      if (spirit.y <= spirit.size || spirit.y >= this.canvas.height - spirit.size) {
        spirit.vy *= -0.8;
        spirit.y = Math.max(spirit.size, Math.min(this.canvas.height - spirit.size, spirit.y));
      }
      
      spirit.pulsePhase += 0.1;
      spirit.currentGlow = spirit.glow + Math.sin(spirit.pulsePhase) * 5;
      
      for (let location of this.locations) {
        if (location.tasks.length > 0) {
          const dx = location.x - spirit.x;
          const dy = location.y - spirit.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0 && distance < 150) {
            const force = 0.02 / distance;
            spirit.vx += (dx / distance) * force;
            spirit.vy += (dy / distance) * force;
          }
        }
      }
      
      spirit.vx *= 0.99;
      spirit.vy *= 0.99;
    });
  }
  
  updateParticles() {
    this.particles = this.particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.1;
      particle.life--;
      return particle.life > 0;
    });
  }
  
  render() {
    this.ctx.fillStyle = 'rgba(0, 20, 40, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.locations.forEach(location => {
      const taskCount = location.tasks.length;
      
      this.ctx.beginPath();
      this.ctx.arc(location.x, location.y, location.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = taskCount > 0 ? location.color : '#444';
      this.ctx.fill();
      
      this.ctx.strokeStyle = taskCount > 0 ? '#fff' : '#666';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      if (taskCount > 0) {
        this.ctx.beginPath();
        this.ctx.arc(location.x + 35, location.y - 35, 15, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FF6B6B';
        this.ctx.fill();
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(taskCount.toString(), location.x + 35, location.y - 30);
      }
      
      this.ctx.fillStyle = taskCount > 0 ? '#fff' : '#999';
      this.ctx.font = 'bold 12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(location.name, location.x, location.y + 5);
    });
    
    this.spirits.forEach(spirit => {
      const gradient = this.ctx.createRadialGradient(
        spirit.x, spirit.y, 0,
        spirit.x, spirit.y, spirit.size + spirit.currentGlow
      );
      gradient.addColorStop(0, spirit.color);
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(spirit.x, spirit.y, spirit.size + spirit.currentGlow, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.fillStyle = spirit.color;
      this.ctx.beginPath();
      this.ctx.arc(spirit.x, spirit.y, spirit.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.fillStyle = '#fff';
      this.ctx.beginPath();
      this.ctx.arc(spirit.x - 5, spirit.y - 3, 2, 0, Math.PI * 2);
      this.ctx.arc(spirit.x + 5, spirit.y - 3, 2, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.strokeStyle = '#fff';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(spirit.x, spirit.y + 3, 4, 0, Math.PI);
      this.ctx.stroke();
    });
    
    this.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      this.ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      
      if (particle.text) {
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(particle.text, particle.x, particle.y);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });
    
    if (this.showTaskModal && this.selectedTask) {
      this.drawTaskModal();
    }
    
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(10, this.canvas.height - 50, this.canvas.width - 20, 40);
    
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Click spirits or locations to interact • Red circles show task count • ESC to close modal', 20, this.canvas.height - 25);
  }
  
  drawTaskModal() {
    const task = this.selectedTask;
    if (!task) return;
    
    const modalWidth = 350;
    const modalHeight = 250;
    const modalX = (this.canvas.width - modalWidth) / 2;
    const modalY = (this.canvas.height - modalHeight) / 2;
    
    // Modal background with gradient
    const gradient = this.ctx.createLinearGradient(modalX, modalY, modalX, modalY + modalHeight);
    gradient.addColorStop(0, 'rgba(0, 44, 84, 0.98)');
    gradient.addColorStop(1, 'rgba(0, 20, 40, 0.98)');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(modalX, modalY, modalWidth, modalHeight);
    
    // Modal border with temperature-based color
    const temp = task.temperature || 0;
    let borderColor = '#66B2FF';
    if (temp > 80) borderColor = '#FF6B6B';
    else if (temp > 60) borderColor = '#FFCC00';
    
    this.ctx.strokeStyle = borderColor;
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(modalX, modalY, modalWidth, modalHeight);
    
    // Task title
    this.ctx.fillStyle = '#FFCC00';
    this.ctx.font = 'bold 18px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(task.title, modalX + modalWidth / 2, modalY + 35);
    
    // Temperature indicator
    const tempEmoji = temp > 80 ? '🔥' : temp > 60 ? '🌶️' : temp > 40 ? '♨️' : '🫖';
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '24px Arial';
    this.ctx.fillText(tempEmoji, modalX + modalWidth - 40, modalY + 35);
    
    // Task details
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'left';
    
    const details = [
      `Category: ${task.category}`,
      `Value: ${task.value?.toLocaleString() || 0}`,
      `Holder: ${this.teamStats[task.holder]?.name || 'Unknown'}`,
      `Temperature: ${Math.round(temp)}°`,
      `Time Left: ${task.timeLeft || 0}s`,
      `Passes: ${task.passCount || 0}`
    ];
    
    details.forEach((detail, index) => {
      this.ctx.fillText(detail, modalX + 20, modalY + 70 + index * 22);
    });
    
    // Progress bar for temperature
    const barWidth = modalWidth - 40;
    const barHeight = 8;
    const barX = modalX + 20;
    const barY = modalY + 200;
    
    // Background bar
    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Temperature bar
    this.ctx.fillStyle = temp > 80 ? '#FF6B6B' : temp > 60 ? '#FFCC00' : '#66B2FF';
    this.ctx.fillRect(barX, barY, (barWidth * temp) / 100, barHeight);
    
    // Action buttons
    const isMyTask = task.holder === this.currentUser;
    
    if (isMyTask) {
      // Pass button
      this.ctx.fillStyle = '#FFCC00';
      this.ctx.fillRect(modalX + 20, modalY + 220, 100, 25);
      this.ctx.fillStyle = '#000';
      this.ctx.font = 'bold 12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Pass Task', modalX + 70, modalY + 237);
      
      // Complete button
      this.ctx.fillStyle = '#2ECC71';
      this.ctx.fillRect(modalX + 130, modalY + 220, 100, 25);
      this.ctx.fillStyle = '#fff';
      this.ctx.fillText('Complete', modalX + 180, modalY + 237);
      
      // Close button
      this.ctx.fillStyle = '#FF6B6B';
      this.ctx.fillRect(modalX + 240, modalY + 220, 80, 25);
      this.ctx.fillStyle = '#fff';
      this.ctx.fillText('Close', modalX + 280, modalY + 237);
    } else {
      // Just close button for tasks not owned by current user
      this.ctx.fillStyle = '#FF6B6B';
      this.ctx.fillRect(modalX + modalWidth/2 - 40, modalY + 220, 80, 25);
      this.ctx.fillStyle = '#fff';
      this.ctx.font = 'bold 12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Close', modalX + modalWidth/2, modalY + 237);
    }
    
    // Handle button clicks (add event listener if not already added)
    if (!this.modalClickHandler) {
      this.modalClickHandler = (event) => {
        if (!this.showTaskModal) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        if (y >= modalY + 220 && y <= modalY + 245) {
          if (isMyTask) {
            if (x >= modalX + 20 && x <= modalX + 120) {
              // Pass button clicked
              this.onTaskClick(task);
              this.showTaskModal = false;
              this.selectedTask = null;
            } else if (x >= modalX + 130 && x <= modalX + 230) {
              // Complete button clicked
              this.onTaskComplete(task);
              this.showTaskModal = false;
              this.selectedTask = null;
              this.updateTaskLocations();
            } else if (x >= modalX + 240 && x <= modalX + 320) {
              // Close button clicked
              this.showTaskModal = false;
              this.selectedTask = null;
            }
          } else {
            if (x >= modalX + modalWidth/2 - 40 && x <= modalX + modalWidth/2 + 40) {
              // Close button clicked
              this.showTaskModal = false;
              this.selectedTask = null;
            }
          }
        }
      };
      this.canvas.addEventListener('click', this.modalClickHandler);
    }
  }
  
  gameLoop() {
    if (!this.isRunning) return;
    
    this.updateSpirits();
    this.updateParticles();
    this.updateTaskLocations();
    this.render();
    
    this.animationId = requestAnimationFrame(this.gameLoop);
  }
}

export default HotPotatoGame;