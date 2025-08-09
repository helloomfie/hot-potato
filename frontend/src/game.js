class HotPotatoGame {
  constructor(canvasId, gameState, updateScore, hotPotatoes, teamStats, currentUser, onTaskClick, onTaskComplete) {
    // Ensure canvas exists before proceeding
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`Canvas element with ID '${canvasId}' not found`);
      throw new Error(`Canvas element with ID '${canvasId}' not found`);
    }
    
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      console.error('Could not get 2D context from canvas');
      throw new Error('Could not get 2D context from canvas');
    }
    
    this.hotPotatoes = hotPotatoes || [];
    this.teamStats = teamStats || {};
    this.currentUser = currentUser;
    this.updateScore = updateScore || (() => {});
    this.onTaskClick = onTaskClick || (() => {});
    this.onTaskComplete = onTaskComplete || (() => {});
    
    this.isRunning = false;
    this.spirits = [];
    this.locations = this.initializeLocations();
    this.hoveredSpirit = null;
    
    try {
      this.loadImages();
      this.resizeCanvas();
      this.bindEvents();
    } catch (error) {
      console.error('Error initializing HotPotatoGame:', error);
      throw error;
    }
  }
  
  async loadImages() {
    this.images = {};
    const imageUrls = {
      background: 'myimages/background.png',
      spirit1: 'myimages/spirit1.png',
      spirit2: 'myimages/spirit2.png', 
      spirit3: 'myimages/spirit3.png'
    };
    
    for (const [key, url] of Object.entries(imageUrls)) {
      const img = new Image();
      img.src = url;
      this.images[key] = img;
    }
  }
  
  initializeLocations() {
    return [
      { name: "Sales Office", x: 20.8, y: 76.2, category: "Sales" },
      { name: "New Lead", x: 20.2, y: 39.1, category: "New Lead" },
      { name: "New Customer", x: 42.0, y: 26.0, category: "New Customer" }, // Moved further north (30.0→26.0)
      { name: "Pre-Construction", x: 69.0, y: 24.4, category: "Pre-Construction" },
      { name: "Construction", x: 71.6, y: 65.4, category: "Construction" },
      { name: "Post Construction", x: 86.6, y: 77.1, category: "Post Construction" }
    ];
  }
  
  generateSpirits() {
    this.spirits = [];
    
    this.locations.forEach(location => {
      const actualX = (location.x / 100) * this.canvas.width;
      const actualY = (location.y / 100) * this.canvas.height;
      
      const tasksAtLocation = this.hotPotatoes.filter(task => task.category === location.category);
      
      if (tasksAtLocation.length > 0) {
        const taskDifficulty = tasksAtLocation[0].difficulty;
        
        this.spirits.push({
          x: actualX,
          y: actualY,
          difficulty: taskDifficulty,
          location: location,
          size: Math.min(this.canvas.width, this.canvas.height) * 0.025
        });
      }
    });
  }
  
  getTaskCount(location, difficulty) {
    return this.hotPotatoes.filter(task => 
      task.category === location.category && task.difficulty === difficulty
    ).length;
  }
  
  resizeCanvas() {
    this.canvas.width = 800;
    this.canvas.height = 500;
  }
  
  start() {
    this.isRunning = true;
    this.generateSpirits();
    this.gameLoop();
  }
  
  stop() {
    this.isRunning = false;
  }
  
  bindEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
      const mouseY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
      
      let newHoveredSpirit = null;
      
      for (let spirit of this.spirits) {
        const distance = Math.sqrt((mouseX - spirit.x) ** 2 + (mouseY - spirit.y) ** 2);
        if (distance < 30) {
          newHoveredSpirit = spirit;
          break;
        }
      }
      
      this.hoveredSpirit = newHoveredSpirit;
      this.canvas.style.cursor = this.hoveredSpirit ? 'pointer' : 'default';
    });
    
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
      const mouseY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
      
      for (let spirit of this.spirits) {
        const distance = Math.sqrt((mouseX - spirit.x) ** 2 + (mouseY - spirit.y) ** 2);
        if (distance < 30) {
          this.handleSpiritClick(spirit);
          return;
        }
      }
    });
    
    this.canvas.addEventListener('mouseleave', () => {
      this.hoveredSpirit = null;
      this.canvas.style.cursor = 'default';
    });
  }
  
  handleSpiritClick(spirit) {
    const tasksAtLocation = this.hotPotatoes.filter(task => task.category === spirit.location.category);
    if (tasksAtLocation.length > 0) {
      const task = tasksAtLocation[0];
      this.onTaskClick(task);
    }
  }
  
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // High-quality background rendering
    if (this.images.background) {
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
      this.ctx.drawImage(this.images.background, 0, 0, this.canvas.width, this.canvas.height);
    }
    
    this.locations.forEach((location, index) => {
      const actualX = (location.x / 100) * this.canvas.width;
      const actualY = (location.y / 100) * this.canvas.height;
      
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(actualX - 60, actualY - 80, 120, 25);
      
      this.ctx.fillStyle = '#fff';
      this.ctx.font = 'bold 12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(location.name, actualX, actualY - 67);
    });
    
    this.spirits.forEach(spirit => {
      const spiritImage = this.getSpiritImage(spirit.difficulty);
      
      if (spiritImage && spiritImage.complete && spiritImage.naturalWidth > 0) {
        const isHovered = this.hoveredSpirit === spirit;
        const imageSize = isHovered ? 90 : 60; // Smaller spirits: 60 default, 90 on hover
        
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        
        this.ctx.drawImage(spiritImage, spirit.x - imageSize/2, spirit.y - imageSize/2, imageSize, imageSize);
      }
    });
  }
  
  getSpiritImage(difficulty) {
    const imageMap = { common: 'spirit1', rare: 'spirit2', epic: 'spirit3' };
    return this.images[imageMap[difficulty]];
  }
  
  getSpiritColor(difficulty) {
    const colorMap = { common: '#66B2FF', rare: '#9B59B6', epic: '#FF6B6B' };
    return colorMap[difficulty] || '#66B2FF';
  }
  
  gameLoop() {
    if (!this.isRunning) return;
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }
}

export default HotPotatoGame;