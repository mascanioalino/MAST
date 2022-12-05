<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main class="mainPage">
    <section class="work">
      <section class="image">
        <div class="details">
          <p class="button" v-on:click="this.toggleShow">
            {{ this.showPoints ? "[hide all points]" : "[show all points]" }}
          </p>
          <p class="button" v-on:click="this.toggleAnnotating">
            {{ this.annotating ? "[back]" : "[+]" }}
          </p>
        </div>

        <p class="guidance">
          {{
            this.annotating && this.pointSelected ? "You selected a point" : ""
          }}
          {{
            this.annotating && !this.pointSelected
              ? "Select an existing point or create a new one"
              : ""
          }}
        </p>
        <WorkCanvas
          :annotating="this.annotating"
          ref="canvas"
          v-on:pointSelected="(f) => reload(f)"
          :showPoints="this.showPoints"
        />
        <footer class="workInfo">
          <h1>{{ work.title }}</h1>
        </footer>
      </section>
      <!-- TODO ANNOTATIONS -->
      <div class="annotations">
        <div class="contents">
          <AnnotationComponent
            v-for="annotation in displayedAnnotations"
            v-on:deletion="() => annotationUpdate(null)"
            :key="annotation.id"
            :annotation="annotation"
          />
        </div>

        <footer>
          <CreateNewAnnotationForm
            v-if="this.annotating"
            @submit="loadAnnotations"
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
      annotationEntered: "",
      pointSelected: null,
      displayedAnnotations: {},
      showPoints: true,
    };
  },
  mounted() {
    this.getWork(this.$route.params.harvardId);
  },
  methods: {
    reload(f) {
      this.pointSelected = f;
      this.loadAnnotations();
    },
    annotationUpdate(f) {
      this.$refs.canvas
        .getPoints(this.work)
        .then(() => this.$refs.canvas.drawPoints());
      this.loadAnnotations();
      this.pointSelected = f;
    },
    toggleAnnotating() {
      this.annotating = !this.annotating;
      if (!this.annotating) {
        this.pointSelected = null;
        this.annotationEntered = null;
        this.$refs.canvas.drawPoints();
        this.loadAnnotations();
      }
    },
    async loadAnnotations() {
      if (!this.annotating && this.pointSelected == null) {
        // Load all annotations
        var allAnnotations = [];
        for (var point of this.work.points) {
          const url = `/api/annotations/${point._id}`;
          const res = await fetch(url).then(async (r) => r.json());
          if (res.error) {
            this.$router.push({ name: "Not Found" });
          }
          if (res.length > 0) {
            // Some points don't have annotations right now
            // console.log(res);
            for (var ann of res) {
              allAnnotations.push(ann);
            }
          }
        }
        this.displayedAnnotations = allAnnotations;
      } else if (this.pointSelected && this.pointSelected._id) {
        // Loads annotations from that point only
        const url = `/api/annotations/${this.pointSelected._id}`;
        const res = await fetch(url).then(async (r) => r.json());
        if (res.error) {
          this.$router.push({ name: "Not Found" });
        }
        this.displayedAnnotations = res;
      } else if (this.pointSelected) {
        this.displayedAnnotations = {};
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
}
img {
  width: 100%;
  height: 100%;
  position: relative;
  top: 0px;
  left: 0px;
}
footer {
  max-width: 600px;
}
h1 {
  text-align: center;
}
body {
  text-align: center;
  background: #f2f6f8;
}

.work {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.image {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 50%;
}
.annotations {
  display: flex;
  flex-direction: column;
  margin-left: 24px;
  background-color: #bde3ff;
  border-radius: 10px;
  width: 50%;
  height: 80vh;
}

.contents {
  padding: 8px;
  overflow-y: scroll;
}
.button {
  cursor: pointer;
}
.guidance {
  align-self: center;
  margin: 0px;
}
.details {
  display: flex;
  justify-content: space-between;
}
</style>
