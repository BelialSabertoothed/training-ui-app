import React, { useCallback, useMemo } from "react";
import { Container } from "reactstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import axios from "axios";
import { DataTableCard2, DateTime } from "asab_webui_components";

export function TableScreen(props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { app } = props;

  const columns = useMemo(
    () => [
      {
        title: t("Training|Username") || "Username",
        sort: "username",
        render: ({ row }) => (
          <span
            title={`ID: ${row.id}`}
            style={{
              cursor: "pointer",
              color: "#007bff",
              textDecoration: "underline",
            }}
            onClick={() => navigate(`/detail/${row.id}`)}
          >
            {row.username}
          </span>
        ),
      },
      {
        title: "Email",
        sort: "email",
        render: ({ row }) => row.email,
      },
      {
        title: t("Training|Created") || "Created",
        sort: "created",
        render: ({ row }) => <DateTime value={row.created} />,
      },
	  {
		title: t("Training|Address") || "Address",
		sort: "address",
		width: "30%",
		render: ({ row }) => row.address,
	  },
	  {
		title: t("Training|Last sign in") || "Last sign in",
		sort: "last_sign_in",
		render: ({ row }) => <DateTime value={row.last_sign_in} />,
	  }
    ],
    [t, navigate],
  );

  const loader = useCallback(async ({ params }) => {
    try {
      const response = await axios.get("https://devtest.teskalabs.com/data", {
        params: params,
      });
      return {
        count: response.data.count || 0,
        rows: response.data.data || [],
      };
    } catch (error) {
      console.error("Chyba loaderu:", error);
      return { rows: [], count: 0 };
    }
  }, []);

  const Header = () => (
    <div className="flex-fill">
      <h3 className="m-0">
        <i className="bi bi-people pe-2"></i>
        {t("Training|Users") || "Users"}
      </h3>
    </div>
  );

  return (
    <Container fluid className="pt-3">
      <DataTableCard2
        app={app}
        columns={columns}
        loader={loader}
        header={<Header />}
      />
    </Container>
  );
}