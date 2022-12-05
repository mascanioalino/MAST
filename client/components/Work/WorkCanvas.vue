<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <section class="work">
    <div class="outsideWrapper">
      <div class="insideWrapper">
        <img class="img" :src="work.imageUrl" :alt="work.title" id="image" />
        <canvas
          class="coveringCanvas hover"
          :class="{ hide: !this.showPoints }"
          v-on:click="checkPoint"
          id="canvas"
        ></canvas>
      </div>
    </div>
  </section>
</template>

<script>
const unselected = "#FFCD29";
const selected = "#0D99FF";
export default {
  name: "WorkCanvas",
  data() {
    return {
      work: {},
      alerts: {},
      points: [],
      paths: [],
      canvas: {},
      height: {},
      width: {},
    };
  },
  props: {
    annotating: {
      type: Boolean,
    },
    showPoints: {
      type: Boolean,
      default: true,
    },
  },
  created() {
    this.getWork(this.$route.params.harvardId);
  },
  mounted() {
    this.getWork(this.$route.params.harvardId);
    this.getCanvas();
    this.width = this.$el.clientWidth;
    this.height = this.$el.clientHeight;
  },
  beforeMount() {
    this.getWork(this.$route.params.harvardId);
    this.getCanvas();
  },
  updated() {
    this.width = this.$el.clientWidth;
    this.height = this.$el.clientHeight;
    this.drawPoints();
  },
  methods: {
    checkPoint(e) {
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left; //x position within the element.
      var y = e.clientY - rect.top; //y position within the element.
      const xPercent = x / rect.width;
      const yPercent = y / rect.height;
      var existingPoint = null;
      var ctx = this.canvas.getContext("2d");

      //Check if point is already on canvas
      for (var path of this.paths) {
        if (
          ctx.isPointInPath(path, xPercent * this.width, yPercent * this.height)
        ) {
          existingPoint = this.points[this.paths.indexOf(path)]; //Get the corresponding point
          this.drawPoints();
          ctx.fillStyle = selected;
          ctx.fill(path);
          this.$emit("pointSelected", existingPoint);
        }
      }

      if (!existingPoint) {
        if (this.annotating) {
          const pointToCreate = {
            xLocation: Math.round(xPercent * 100),
            yLocation: Math.round(yPercent * 100),
          };
          this.drawPoints();
          this.drawPoint(xPercent, yPercent, ctx, selected);

          this.$emit("pointSelected", pointToCreate);
          console.log("New Point:", pointToCreate);
        } else {
          this.drawPoints();
          this.$emit("pointSelected", null);
        }
      }
    },
    getCanvas() {
      this.canvas = document.getElementById("canvas");
    },
    fitToContainer() {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    },
    drawPoints() {
      this.paths = [];
      var ctx = this.canvas.getContext("2d");
      this.fitToContainer();
      for (var p of this.points) {
        var xPercent = p.xLocation / 100;
        var yPercent = p.yLocation / 100;
        this.drawPoint(xPercent, yPercent, ctx, unselected);
      }
    },
    drawPoint(x, y, ctx, color) {
      ctx.fillStyle = color;
      const path = new Path2D();
      path.arc(
        x * this.width,
        y * this.height,
        10, //radius
        0, //start angle
        2 * Math.PI, //end angle
        true
      );
      ctx.fill(path);
      ctx.stroke(path);
      this.paths.push(path);
    },
    async getWork(harvardId) {
      const url = `/api/works/${harvardId}`;
      const res = await fetch(url).then(async (r) => r.json());
      if (res.error) {
        this.$router.push({ name: "Not Found" });
      }
      this.work = res.work;
      this.getPoints(this.work).then(() => this.drawPoints());
    },
    async getPoints(work) {
      const url = `/api/points/${work._id}`;
      const res = await fetch(url).then(async (r) => r.json());
      if (res.error) {
        this.$router.push({ name: "Not Found" });
      }
      this.points = res.points;
    },
    async addWork(harvardId) {
      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
      };

      try {
        const r = await fetch(`/api/visits/${harvardId}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$set(this.alerts, "Successfully added work to visit!", "success");
        setTimeout(
          () => this.$delete(this.alerts, "Successfully added work to visit!"),
          3000
        );
        this.$store.commit("refreshVisitWorks");
        this.$router.push({ name: "Visit" });
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
img {
  width: 100%;
  height: 100%;
  position: relative;
  top: 0px;
  left: 0px;
}

.work {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-self: center;
}

.image {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.outsideWrapper {
  box-sizing: border-box;
  max-width: 600px;
  padding: 32px;
  border: 16px solid #222222;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.insideWrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
.coveredImage {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
}
.coveringCanvas {
  background-color: transparent;
}

canvas {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.hover {
  cursor: pointer;
}

.hide {
  display: none;
}
</style>
