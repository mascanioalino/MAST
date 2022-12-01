<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <section class="work">
    <div class="outsideWrapper">
      <div class="insideWrapper">
        <img class="img" :src="work.imageUrl" :alt="work.title" id="image" />
        <canvas class="coveringCanvas" id="canvas"></canvas>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "WorkCanvas",
  data() {
    return {
      work: {},
      alerts: {},
      points: [],
      canvas: {},
      height: {},
      width: {},
    };
  },
  created() {
    this.getWork(this.$route.params.harvardId);
  },
  mounted() {
    this.getWork(this.$route.params.harvardId);
    this.getCanvas();
    this.width = this.$el.clientWidth;
    this.height = this.$el.clientHeight;
    // this.drawPoints();
  },
  updated() {
    // this.getWork(this.$route.params.harvardId);
    this.width = this.$el.clientWidth;
    this.height = this.$el.clientHeight;
    this.drawPoints();
  },
  methods: {
    getCanvas() {
      this.canvas = document.getElementById("canvas");
    },
    fitToContainer() {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    },
    drawPoints() {
      var ctx = this.canvas.getContext("2d");
      this.fitToContainer();
      ctx.fillStyle = "#FFCD29";
      for (var p of this.points) {
        var xPercent = p.xLocation / 100;
        var yPercent = p.yLocation / 100;
        ctx.beginPath();
        ctx.arc(
          xPercent * this.width,
          yPercent * this.height,
          10, //radius
          0, //start angle
          2 * Math.PI, //end angle
          true
        );
        ctx.fill();
        ctx.stroke();
      }
    },
    async getWork(harvardId) {
      const url = `/api/works/${harvardId}`;
      const res = await fetch(url).then(async (r) => r.json());
      if (res.error) {
        this.$router.push({ name: "Not Found" });
      }
      this.work = res.work;
      this.getPoints(this.work);
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
        console.log(r);
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
</style>