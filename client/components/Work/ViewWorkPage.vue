<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main class="mainPage">
    <section class="work">
      <section class="image">
        <p class="add" v-on:click="this.toggleAnnotating">
          {{ this.annotating ? "[back]" : "[+]" }}
        </p>
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
          v-on:pointSelected="(f) => (this.pointSelected = f)"
        />
        <footer class="workInfo">
          <h1>{{ work.title }}</h1>
        </footer>
      </section>
      <!-- TODO ANNOTATIONS -->
      <AnnotationComponent
        v-for="annotation in displayedAnnotations"
        :key="annotation.id"
        :annotation="annotation"
      />
      <footer>
        <CreateNewAnnotationForm
          :pointSelected="this.pointSelected"
          :annotationEntered="this.annotationEntered"
        />

      </footer>
      <section>
        
      </section>
    </section>
  </main>
</template>

<script>
import WorkCanvas from "@/components/Work/WorkCanvas.vue";
import AnnotationComponent from '@/components/Annotation/AnnotationComponent.vue';
import CreateNewAnnotationForm from '@/components/Annotation/CreateNewAnnotationForm.vue';

export default {
  name: "ViewWorkPage",
  beforeRouteUpdate(to, from, next) {
    this.getWork(to.params.harvardId);
    next();
  },
  components: {
    WorkCanvas, AnnotationComponent, CreateNewAnnotationForm
  },
  data() {
    return {
      work: {},
      alerts: {},
      annotating: false,
      annotationEntered: null,
      pointSelected: null,
      displayedAnnotations: {}
    };
  },
  mounted() {
    this.getWork(this.$route.params.harvardId);
    // this.loadAnnotations(); 
  },
  methods: {
    toggleAnnotating() {
      this.annotating = !this.annotating;
      if (!this.annotating) {
        this.pointSelected = null;
        this.annotationEntered = null;
      }
    },
    async loadAnnotations() {
      if (!this.annotating && this.pointSelected == null) { // Load all annotations 
        var allAnnotations = [];
        // console.log(this.work.points)
        for (var point of this.work.points) {
          const url = `/api/annotations/${point._id}`;
          const res = await fetch(url).then(async (r) => r.json());
          if (res.error) {
            this.$router.push({ name: "Not Found" });
          }
          if (res.length > 0) { // Some points don't have annotations right now 
            // console.log(res);
            for (var ann of res){
              allAnnotations.push(ann); 
            }
          }
        }
        this.displayedAnnotations = allAnnotations;
      }
      else if (this.pointSelected._id) { // Loads annotations from that point only 
        const url = `/api/${this.pointSelected._id}`;
        const res = await fetch(url).then(async (r) => r.json());
        if (res.error) {
          this.$router.push({ name: "Not Found" });
        }
        this.displayedAnnotations = res
      }

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
    async addPoint(xPercent, yPercent) {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          xLocation: xPercent,
          yLocation: yPercent,
          workId: this.work._id,
        }),
      };

      try {
        const url = `/api/points`;
        const r = await fetch(url, options);

        if (!r.ok) {
          const res = await r.json;
          throw new Error(res.error);
        }
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
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
  justify-content: space-between;
}

.image {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.add {
  align-self: flex-end;
  cursor: pointer;
}
.guidance {
  align-self: center;
  margin: 0px;
}
</style>
