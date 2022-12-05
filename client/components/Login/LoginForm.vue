<!-- Form for signing in (block style) -->

<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
  name: "LoginForm",
  mixins: [BlockForm],
  data() {
    return {
      url: "/api/curators/session",
      method: "POST",
      hasBody: true,
      setUsername: true,
      setDateJoined: true,
      fields: [
        { id: "username", label: "Username", value: "" },
        { id: "password", label: "Password", value: "" },
      ],
      title: "Log In",
      callback: () => {
        this.$router.push({ name: "Home" });
        // this.$store.commit("alert", {
        //   message: "You are now signed in!",
        //   status: "success",
        // });
        this.$store.commit("setVisitId", null);
      },
    };
  },
};
</script>
