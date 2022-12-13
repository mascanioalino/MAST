<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main class="mainPage">
    <section class="work">
      <section class="image">
        <div class="top-tools">
          <button class="back-button" v-on:click="this.goBack">
            <b-icon icon="arrow-left" font-scale="1.5" aria-hidden="true" />
          </button>
          <h1>{{ work.title }}</h1>
          <button class="back-button" v-on:click="this.goBack"></button>
        </div>
        <WorkCanvas
          class="canvas"
          :annotating="this.annotating"
          ref="canvas"
          v-on:pointSelected="(f) => reload(f)"
          :showPoints="this.showPoints"
        />
      </section>

      <div class="annotations">
        <div class="details">
          <button
            class="button"
            v-on:click="this.toggleShow"
            v-if="!this.annotating"
          >
            {{ this.showPoints ? "Hide all points" : "Show all points" }}
          </button>
          <p class="button" v-on:click="this.toggleShow" v-else></p>

          <button class="button" v-on:click="this.toggleAnnotating">
            {{ this.annotating ? "back" : "Add Annotation +" }}
          </button>
        </div>

        <div class="loading" v-if="loading">Loading Annotations...</div>

        <div v-else class="contents">
          <AnnotationComponent
            v-for="annotation in displayedAnnotations"
            v-on:deletion="() => annotationUpdate(null)"
            :key="annotation.id"
            :annotation="annotation"
          />
        </div>

        <footer class="annotationForm">
          <CreateNewAnnotationForm
            v-if="this.annotating"
            @submit="submitClicked"
            :pointSelected="this.pointSelected"
            :annotationEntered="this.annotationEntered"
            :work="this.work"
            v-on:creation="(f) => annotationUpdate(f)"
          />
        </footer>
      </div>
    </section>
  </main>
</template>

<script>
import WorkCanvas from "@/components/Work/WorkCanvas.vue";
import AnnotationComponent from "@/components/Annotation/AnnotationComponent.vue";
import CreateNewAnnotationForm from "@/components/Annotation/CreateNewAnnotationForm.vue";

export default {
  name: "ViewWorkPage",
  beforeRouteUpdate(to, from, next) {
    this.getWork(to.params.harvardId);
    next();
  },
  created() {
    this.$root.$refs.ViewWorkPage = this;
  },
  components: {
    WorkCanvas,
    AnnotationComponent,
    CreateNewAnnotationForm,
  },
  data() {
    return {
      work: {},
      alerts: {},
      annotating: false,
      loading: false,
      annotationEntered: "",
      pointSelected: null,
      displayedAnnotations: [],
      showPoints: true,
      pointDict: {},
      allAnnotations: [],
    };
  },
  mounted() {
    this.getWork(this.$route.params.harvardId);
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    reload(f) {
      this.pointSelected = f;
      this.updateDisplayedPoints();
      console.log("reload....");
    },
    annotationUpdate(f) {
      this.$refs.canvas
        .getPoints(this.work)
        .then(() => this.$refs.canvas.drawPoints());
      // this.loadAnnotations();
      this.pointSelected = f;
    },
    toggleAnnotating() {
      console.log("this.");
      this.annotating = !this.annotating;
      if (!this.annotating) {
        this.pointSelected = null;
        this.annotationEntered = null;
        this.$refs.canvas.drawPoints();
      } else {
        this.showPoints = true;
      }
    },
    updateDisplayedPoints() {
      if (this.pointSelected !== null) {
        this.displayedAnnotations = this.pointDict[this.pointSelected._id];
      } else {
        this.displayedAnnotations = this.allAnnotations;
      }
    },
    async submitClicked() {
      this.annotating = false;
      await this.getWork(this.$route.params.harvardId);
      this.loadAnnotations();
    },

    async loadAnnotations() {
      if (!this.loading) {
        this.allAnnotations = [];
        this.pointDict = {};
        this.displayedAnnotations = [];
        this.loading = true;

        for (var point of this.work.points) {
          const url = `/api/annotations/${point._id}`;
          const res = await fetch(url).then(async (r) => r.json());
          if (res.error) {
            this.$router.push({ name: "Not Found" });
          }
          if (res.length > 0) {
            // Some points don't have annotations right now
            this.pointDict[point._id] = [];
            for (var ann of res) {
              this.pointDict[point._id].push(ann);
              this.allAnnotations.push(ann);
            }
          }
        }
        this.displayedAnnotations = this.allAnnotations;
        this.loading = false;
      }
    },
    toggleShow() {
      this.showPoints = !this.showPoints;
    },
    async getWork(harvardId) {
      const url = `/api/works/${harvardId}`;
      const res = await fetch(url).then(async (r) => r.json());
      if (res.error) {
        this.$router.push({ name: "Not Found" });
      }
      this.work = res.work;
      this.loadAnnotations();
    },
  },
};
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  position: relative;
}
img {
  width: 100%;
  height: 100%;
  position: relative;
  top: 0px;
  left: 0px;
}
.annotationForm {
  margin-top: auto;
  padding: 8px;
}
.top-tools {
  max-width: 600px;
  min-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1 {
  text-align: center;
}

body {
  text-align: center;
  background: #f2f6f8;
}

html {
  overflow: hidden;
}

.work {
  max-width: 1200px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 75%;
  position: relative;
  max-width: 1200px;
}

.image {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: calc(50% - 10px);
}
.annotations {
  display: flex;
  min-height: calc(100vh - 200px);
  position: relative;
  flex-direction: column;
  margin-left: 24px;
  background-color: #ececec;
  border-radius: 10px;
  width: calc(50% - 20px);
  overflow-y: scroll;
}

.loading {
  width: 100%;
  text-align: center;
  padding-top: 20px;
  text-decoration: italic;
}

.contents {
  padding: 8px;
  overflow-y: auto;
}

.button {
  cursor: pointer;
  background-color: transparent;
  color: black;
  width: fit-content;
  height: fit-content;
  border-radius: 20px;
  border-color: black;
  border-width: 1.5px;
}

.back-button {
  cursor: pointer;
  background-color: transparent;
  color: black;
  width: fit-content;
  height: fit-content;
  border-color: transparent;
  margin-top: 9px;
  padding: 0;
}

.canvas {
  width: 100%;
}
.guidance {
  align-self: center;
  margin-top: 0px;
}
.details {
  position: sticky;
  top: 0px;
  left: 0px;
  padding: 10px;
  background-color: #ececec;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.details .button {
  margin-right: 20px;
}

@media only screen and (max-width: 840px) {
  .work {
    display: block;
  }
  .image {
    width: calc(100% - 20px);
    margin: auto;
  }
  .annotations {
    width: calc(100% - 20px);
    margin: auto;
    max-height: 600px;
    margin-top: 30px;
  }
}
</style>
