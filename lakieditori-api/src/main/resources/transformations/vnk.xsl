<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:vah="http://www.vn.fi/skeemat/vahvistettavalaki/2010/04/27"
  xmlns:asi="http://www.vn.fi/skeemat/asiakirjakooste/2010/04/27"
  xmlns:asi1="http://www.vn.fi/skeemat/asiakirjaelementit/2010/04/27"
  xmlns:met="http://www.vn.fi/skeemat/metatietokooste/2010/04/27"
  xmlns:met1="http://www.vn.fi/skeemat/metatietoelementit/2010/04/27"
  xmlns:org="http://www.vn.fi/skeemat/organisaatiokooste/2010/02/15"
  xmlns:org1="http://www.vn.fi/skeemat/organisaatioelementit/2010/02/15"
  xmlns:saa="http://www.vn.fi/skeemat/saadoskooste/2010/04/27"
  xmlns:saa1="http://www.vn.fi/skeemat/saadoselementit/2010/04/27">

  <xsl:output method="xml" indent="yes" encoding="UTF-8"/>

  <xsl:template match="/statute">
    <vah:VahvistettavaLaki
      met1:asiakirjatyyppiNimi="Asetus"
      met1:eduskuntaTunnus=""
      met1:identifiointiTunnus="0000000000000000"
      met1:kieliKoodi="fi"
      met1:laadintaPvm=""
      met1:rakennemaarittelyNimi="vahvistettavalaki.xsd"
      met1:tilaKoodi="Valmis"
      met1:versioTeksti="1.0">

      <asi:IdentifiointiOsa>
        <met1:AsiakirjatyyppiNimi>
          <xsl:text>Muu asia</xsl:text>
        </met1:AsiakirjatyyppiNimi>
        <asi:EduskuntaTunniste>
          <met1:AsiakirjatyyppiKoodi>
            <xsl:text>M</xsl:text>
          </met1:AsiakirjatyyppiKoodi>
          <asi1:AsiakirjaNroTeksti>
            <xsl:text>nro</xsl:text>
          </asi1:AsiakirjaNroTeksti>
          <asi1:ValtiopaivavuosiTeksti>
            <xsl:text>vvvv</xsl:text>
          </asi1:ValtiopaivavuosiTeksti>
        </asi:EduskuntaTunniste>
        <met:Nimeke>
          <met1:NimekeTeksti>
            <xsl:value-of select="title"/>
          </met1:NimekeTeksti>
        </met:Nimeke>
      </asi:IdentifiointiOsa>

      <saa:SaadosOsa>
        <saa:Saados>
          <xsl:attribute name="met1:kieliKoodi">
            <xsl:text>fi</xsl:text>
          </xsl:attribute>
          <xsl:attribute name="saa1:identifiointiTunnus">
            <xsl:value-of select="@number"/>
          </xsl:attribute>
          <xsl:attribute name="saa1:saadostyyppiNimi">
            <xsl:text>Asetus</xsl:text>
          </xsl:attribute>

          <saa:SaadosNimeke>
            <saa:SaadostyyppiKooste>
              <xsl:value-of select="title"/>
            </saa:SaadostyyppiKooste>
          </saa:SaadosNimeke>
          <saa:Johtolause>
            <saa:SaadosKappaleKooste>
              <xsl:value-of select="intro"/>
            </saa:SaadosKappaleKooste>
          </saa:Johtolause>
          <saa:Pykalisto>
            <xsl:apply-templates select="chapter"/>
          </saa:Pykalisto>
        </saa:Saados>
      </saa:SaadosOsa>

      <asi:AllekirjoitusOsa>
        <asi:PaivaysKooste/>
        <asi:Allekirjoittaja
          asi1:allekirjoitusLuokitusKoodi="Muu"
          asi1:kohdistusKoodi="Keskitetty">
          <org:Henkilo>
            <org1:AsemaTeksti/>
            <org1:EtuNimi/>
            <org1:SukuNimi/>
          </org:Henkilo>
        </asi:Allekirjoittaja>
        <asi:Allekirjoittaja
          asi1:allekirjoitusLuokitusKoodi="Muu"
          asi1:kohdistusKoodi="Oikea">
          <org:Henkilo>
            <org1:AsemaTeksti/>
            <org1:EtuNimi/>
            <org1:SukuNimi/>
          </org:Henkilo>
        </asi:Allekirjoittaja>
      </asi:AllekirjoitusOsa>
    </vah:VahvistettavaLaki>
  </xsl:template>

  <xsl:template match="chapter">
    <saa:Luku>
      <xsl:attribute name="saa1:identifiointiTunnus">
        <xsl:value-of select="@number"/>
        <xsl:text> luku</xsl:text>
      </xsl:attribute>

      <saa:LukuTunnusKooste>
        <xsl:value-of select="@number"/>
        <xsl:text> luku</xsl:text>
      </saa:LukuTunnusKooste>

      <saa:SaadosOtsikkoKooste>
        <xsl:value-of select="heading"/>
      </saa:SaadosOtsikkoKooste>

      <xsl:apply-templates select="section"/>
    </saa:Luku>
  </xsl:template>

  <xsl:template match="section">
    <saa:Pykala>
      <xsl:attribute name="saa1:identifiointiTunnus">
        <xsl:value-of select="@number"/>
        <xsl:text> §</xsl:text>
      </xsl:attribute>

      <xsl:attribute name="saa1:pykalaLuokitusKoodi">
        <xsl:text>Pykala</xsl:text>
      </xsl:attribute>

      <saa:PykalaTunnusKooste>
        <xsl:value-of select="@number"/>
        <xsl:text> §</xsl:text>
      </saa:PykalaTunnusKooste>

      <saa:SaadosOtsikkoKooste>
        <xsl:value-of select="heading"/>
      </saa:SaadosOtsikkoKooste>

      <xsl:apply-templates select="subsection"/>
    </saa:Pykala>
  </xsl:template>

  <xsl:template match="subsection">
    <saa:MomenttiKooste>
      <xsl:value-of select="content"/>
    </saa:MomenttiKooste>
  </xsl:template>

</xsl:stylesheet>