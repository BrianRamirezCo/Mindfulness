import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import AdminReflections from "./pages/admin-view/reflections";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import ProductDetailPage from "./pages/shopping-view/product-detail";
import CheckAuth from "./components/common/check-auth";
import ForgotPassword from "./pages/auth/forgot-password";
import ResetPassword from "./pages/auth/reset-password";
import GoogleSuccess from "./pages/auth/google-success";
import VerifyEmail from "./pages/auth/verify-email";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import PaymentFailurePage from "./pages/shopping-view/payment-failure";
import PaymentPendingPage from "./pages/shopping-view/payment-pending";
import SearchProducts from "./pages/shopping-view/search";
import ReflectionsPage from "./pages/shopping-view/reflections";
import ReflectionDetailPage from "./pages/shopping-view/reflection-detail";
import AboutPage from "./pages/shopping-view/about";
import ContactPage from "./pages/shopping-view/contact";
import TermsPage from "./pages/shopping-view/terms";
import PrivacyPage from "./pages/shopping-view/privacy";
import ReturnsPage from "./pages/shopping-view/returns";
import FaqPage from "./pages/shopping-view/faq";
import CoursesPage from "./pages/shopping-view/courses";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <img
            src="/favicon.png"
            alt="Cargando..."
            className="w-16 h-16 opacity-80 animate-pulse"
          />
          <p className="text-xs text-foreground/40 font-sans tracking-widest uppercase">
            Cargando...
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route
          path="/"
          element={<CheckAuth isAuthenticated={isAuthenticated} user={user} />}
        />
        <Route path="/auth/google/success" element={<GoogleSuccess />} />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="verify-email" element={<VerifyEmail />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="reflections" element={<AdminReflections />} />
        </Route>
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="payment-failure" element={<PaymentFailurePage />} />
          <Route path="payment-pending" element={<PaymentPendingPage />} />
          <Route path="search" element={<SearchProducts />} />
          <Route path="reflections" element={<ReflectionsPage />} />
          <Route path="reflections/:id" element={<ReflectionDetailPage />} />
          <Route path="sobre-mi" element={<AboutPage />} />
          <Route path="contacto" element={<ContactPage />} />
          <Route path="terminos" element={<TermsPage />} />
          <Route path="privacidad" element={<PrivacyPage />} />
          <Route path="devoluciones" element={<ReturnsPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="cursos" element={<CoursesPage />} />
        </Route>
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
