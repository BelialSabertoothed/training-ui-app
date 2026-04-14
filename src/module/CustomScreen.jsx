import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardImg,
  CardHeader,
  Button,
  Badge,
  Alert,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import axios from "axios";
import gsap from "gsap";

const SpaceLoader = ({ text }) => {
  const containerRef = useRef(null);
  const floatRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.to(floatRef.current, {
        y: -25,
        rotation: 6,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Animace teček
      gsap.to(".loading-dot", {
        y: -12,
        stagger: 0.15,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        minHeight: "65vh",
      }}
    >
      <div ref={floatRef} style={{ marginBottom: "1.5rem" }}>
        <i
          className="bi bi-moon-stars text-primary"
          style={{ fontSize: "5rem" }}
        ></i>
      </div>
      <h4
        className="text-muted"
        style={{
          fontSize: "0.875rem",
          fontWeight: "bold",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          marginBottom: "1.25rem",
        }}
      >
        {text}
      </h4>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <div
          className="loading-dot bg-primary"
          style={{ width: "10px", height: "10px", borderRadius: "50%" }}
        ></div>
        <div
          className="loading-dot bg-primary"
          style={{ width: "10px", height: "10px", borderRadius: "50%" }}
        ></div>
        <div
          className="loading-dot bg-primary"
          style={{ width: "10px", height: "10px", borderRadius: "50%" }}
        ></div>
      </div>
    </div>
  );
};

export function CustomScreen() {
  const { t } = useTranslation();
  const [spaceData, setSpaceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState(null);

  const cardWrapRef = useRef(null);
  const contentRef = useRef(null);

  const fetchSpaceInfo = async () => {
    setLoading(true);
    setErrorType(null);
    try {
      const response = await axios.get(
        "https://api.nasa.gov/planetary/apod?api_key=NaigKue4ppc5ThMRhky0cD0v7cN4bLDmkYy0TgE0",
      );
      setSpaceData(response.data);
    } catch (err) {
      console.error("NASA API Error:", err);
      if (err.response?.data?.error?.code === "OVER_RATE_LIMIT") {
        setErrorType("rate_limit");
      } else {
        setErrorType("generic");
      }
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  useEffect(() => {
    fetchSpaceInfo();
  }, []);

  useEffect(() => {
    if (!loading && spaceData && cardWrapRef.current) {
      let ctx = gsap.context(() => {
        const tl = gsap.timeline();

        tl.from(cardWrapRef.current, {
          opacity: 0,
          y: 40,
          scale: 0.98,
          duration: 0.8,
          ease: "power3.out",
        });

        if (contentRef.current) {
          tl.from(
            contentRef.current.children,
            {
              opacity: 0,
              x: 20,
              stagger: 0.1,
              duration: 0.5,
              ease: "power2.out",
            },
            "-=0.4",
          );
        }
      });
      return () => ctx.revert();
    }
  }, [loading, spaceData]);

  if (loading) {
    return (
      <Container fluid className="pt-3">
        <SpaceLoader text={t("Space|Loading") || "Navazuji spojení..."} />
      </Container>
    );
  }

  return (
    <Container fluid className="pt-4 pb-5 px-xl-5">
      <Row className="justify-content-center">
        <Col xs={12} lg={12} xl={11} xxl={10}>
          {errorType && (
            <Alert
              color={errorType === "rate_limit" ? "warning" : "danger"}
              className="d-flex justify-content-between align-items-center shadow-sm rounded-3"
            >
              <div>
                <i className="bi bi-exclamation-triangle-fill pe-2"></i>
                {errorType === "rate_limit"
                  ? t("Space|RateLimit")
                  : t("Space|Error")}
              </div>
              <Button
                color={errorType === "rate_limit" ? "dark" : "danger"}
                size="sm"
                onClick={fetchSpaceInfo}
              >
                <i className="bi bi-arrow-clockwise pe-1"></i>{" "}
                {t("General|Retry") || "Zkusit znovu"}
              </Button>
            </Alert>
          )}

          {spaceData && (
            <div ref={cardWrapRef}>
              <Card className="shadow-lg border-0 overflow-hidden bg-body text-body rounded-4">
                <CardHeader className="bg-body-tertiary d-flex justify-content-between align-items-center py-3 border-bottom border-secondary border-opacity-25">
                  <h5 className="m-0 font-weight-bold d-flex align-items-center">
                    <i className="bi bi-rocket-takeoff pe-2 text-primary fs-4"></i>
                    {t("Space|Title")}
                  </h5>
                  <Badge
                    color="primary"
                    pill
                    className="px-3 py-2 text-uppercase tracking-wider"
                  >
                    NASA API
                  </Badge>
                </CardHeader>

                <Row className="g-0">
                  <Col
                    md={6}
                    lg={7}
                    className="bg-black position-relative d-flex align-items-center justify-content-center min-vh-50"
                  >
                    {spaceData.media_type === "image" ? (
                      <CardImg
                        src={spaceData.url}
                        alt={spaceData.title}
                        className="h-100 w-100 object-fit-cover"
                        style={{ minHeight: "500px" }}
                      />
                    ) : (
                      <div
                        className="d-flex flex-column align-items-center justify-content-center h-100 p-5"
                        style={{ minHeight: "500px" }}
                      >
                        <i className="bi bi-play-circle text-white opacity-50 display-1 mb-3"></i>
                        <p className="text-white opacity-75 text-uppercase tracking-widest">
                          Video Stream
                        </p>
                      </div>
                    )}
                    <Badge
                      color="dark"
                      className="position-absolute top-0 start-0 m-3 px-3 py-2 bg-dark bg-opacity-75 border border-secondary"
                    >
                      <i className="bi bi-calendar3 pe-2"></i>
                      {spaceData.date}
                    </Badge>
                  </Col>

                  <Col
                    md={6}
                    lg={5}
                    className="d-flex flex-column border-start border-secondary border-opacity-10"
                  >
                    <CardBody className="d-flex flex-column h-100">
                      <div
                        ref={contentRef}
                        className="d-flex flex-column h-100"
                      >
                        <div className="mb-3">
                          {spaceData.copyright && (
                            <small className="text-primary fw-bold text-uppercase tracking-wider">
                              © {spaceData.copyright}
                            </small>
                          )}
                          <h2 className="mt-2 fw-bolder mb-4 display-6">
                            {spaceData.title}
                          </h2>
                        </div>

                        <div
                          className="flex-grow-1 overflow-auto mb-4 pe-3"
                          style={{ maxHeight: "400px" }}
                        >
                          <h6 className="text-uppercase text-muted small fw-bold mb-2">
                            {t("Space|Description")}
                          </h6>
                          <p
                            className="text-body-secondary fs-5"
                            style={{ textAlign: "justify", lineHeight: "1.7" }}
                          >
                            {spaceData.explanation}
                          </p>
                        </div>

                        <div className="mt-auto pt-4 border-top border-secondary border-opacity-25">
                          <Button
                            color="primary"
                            size="lg"
                            className="w-100 d-flex align-items-center justify-content-center rounded-3 shadow-sm py-3"
                            href={spaceData.hdurl || spaceData.url}
                            target="_blank"
                          >
                            <i className="bi bi-arrows-fullscreen pe-2"></i>
                            {t("Space|ViewHD")}
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Col>
                </Row>
              </Card>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
