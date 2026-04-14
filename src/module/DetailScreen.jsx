import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  Spinner,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { DateTime } from "asab_webui_components";

const CopyValue = ({ value }) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      color="link"
      size="sm"
      className="p-0 ps-2 text-muted"
      onClick={copyToClipboard}
      title={copied ? "Zkopírováno!" : "Kopírovat"}
    >
      <i
        className={`bi ${copied ? "bi-check-lg text-success" : "bi-copy"}`}
      ></i>
    </Button>
  );
};

export function DetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://devtest.teskalabs.com/detail/${id}`,
      );
      setData(response.data);
    } catch (error) {
      console.error("Chyba při načítání detailu:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Container className="pt-5 text-center">
        <Spinner color="primary" />
      </Container>
    );
  }

  if (!data)
    return (
      <Container className="pt-3 text-center">{t("General|No data")}</Container>
    );

  return (
    <Container fluid className="pt-3">
      <Row className="mb-3 justify-content-center">
        <Col lg={8}>
          <Button
            color="link"
            className="text-decoration-none p-0 d-flex align-items-center text-body"
            onClick={() => navigate("/")}
          >
            <i className="bi bi-arrow-left fs-5 pe-2"></i>
            <span className="fw-semibold">{t("General|Back") || "Back"}</span>
          </Button>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col lg={8} md={12}>
          <Card className="shadow-sm">
            <CardHeader className="d-flex align-items-center border-bottom">
              <i className="bi bi-person-badge fs-4 pe-3 text-primary"></i>
              <h4 className="m-0 fw-bold">
                {t("Training|User Detail") || "User Detail"}: {data.username}
              </h4>
            </CardHeader>
            <CardBody className="p-0">
              <Table responsive className="m-0 border-top-0 table-borderless">
                <tbody>
                  <tr className="border-bottom">
                    <th className="ps-4 text-muted w-25">
                      {t("General|ID") || "ID"}
                    </th>
                    <td>
                      {data.id} <CopyValue value={data.id} />
                    </td>
                  </tr>
                  <tr className="border-bottom">
                    <th className="ps-4 text-muted">
                      {t("Training|Username") || "Username"}
                    </th>
                    <td className="fw-bold">{data.username}</td>
                  </tr>
                  <tr className="border-bottom">
                    <th className="ps-4 text-muted">Email</th>
                    <td>
                      <a href={`mailto:${data.email}`} className="text-decoration-none">
                        {data.email}
                      </a>
                    </td>
                  </tr>
                  <tr className="border-bottom">
                    <th className="ps-4 text-muted">
                      {t("Training|Created") || "Created"}
                    </th>
                    <td>
                      <DateTime value={data.created} />
                    </td>
                  </tr>
                  <tr className="border-bottom">
                    <th className="ps-4 text-muted">
                      {t("Training|Last sign in") || "Last sign in"}
                    </th>
                    <td>
                      <DateTime value={data.last_sign_in} />
                    </td>
                  </tr>
                  <tr className="border-bottom">
                    <th className="ps-4 text-muted">
                      {t("Training|Address") || "Address"}
                    </th>
                    <td>{data.address}</td>
                  </tr>
                  <tr className="border-bottom">
                    <th className="ps-4 text-muted">
                      {t("Training|Phone") || "Phone"}
                    </th>
                    <td>{data.phone_number}</td>
                  </tr>
                  <tr className="border-bottom">
                    <th className="ps-4 text-muted">IP</th>
                    <td>
                      <code>{data.ip_address}</code>{" "}
                      <CopyValue value={data.ip_address} />
                    </td>
                  </tr>
                  <tr>
                    <th className="ps-4 text-muted">MAC</th>
                    <td>
                      <code>{data.mac_address}</code>{" "}
                      <CopyValue value={data.mac_address} />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
