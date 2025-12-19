import api from "../api/api";

export function handleApiError(error, navigate, { logout, login }) {

    if (error.response) {
        const status = error.response.status;

        // Unauthorized → Try refresh token
        if (status === 401) {
            const refreshToken = localStorage.getItem("refreshToken");

            return api.post("/auth/refresh-token", { refreshToken })
                .then((res) => {
                    login(
                        res.data.data.user,
                        res.data.data.accessToken,
                        res.data.data.refreshToken
                    );
                })
                .catch(() => {
                    logout();
                    alert("Sesi login telah berakhir. Silakan login ulang.");
                });
        }

        if (status === 403) return alert("Anda tidak punya izin mengakses ini.");
        if (status === 404) return alert("Data tidak ditemukan.");

        return alert(error.response.data?.message || "Terjadi kesalahan server.");
    }

    // No response from server
    if (error.request) {
        return alert("Gagal menghubungi server. Periksa koneksi internet.");
    }

    // Something else
    console.error("Unexpected API error:", error);
    alert("Terjadi kesalahan tak terduga.");
}
