<!-- Form for deleting account (block style) -->

<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
  name: "DeleteAccountForm",
  mixins: [BlockForm],
  data() {
    return {
      url: "/api/curators",
      method: "DELETE",
      setCuratorDetails: true,
      setCurrentVisitDetails: true,
      title: "Delete account",
      fields: [],
      content: "Deleting your account is irreversible.",
      callback: () => {
        this.$router.push({ name: "Home" }); // Goes to Home page after deleting account
        this.$store.commit("alert", {
          message: "Your account has been deleted!",
          status: "success",
        });
      },
    };
  },
};
</script>
